import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

function generateUsername(name, email, provider) {
  let base = '';
  if (name) {
    base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  } else if (email) {
    base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  if (!base) base = 'user';
  return base;
}

async function getUniqueUsername(base) {
  let username = base;
  let count = 1;
  while (true) {
    const existing = await User.findOne({ username });
    if (!existing) return username;
    username = `${base}${count}`;
    count++;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        const email = user.email;
        const provider = account.provider;
        const providerId = account.providerAccountId;
        const name = user.name || profile?.login || '';
        const image = user.image || '';

        let existingUser = await User.findOne({ email });

        if (!existingUser) {
          // New user — create account
          const baseUsername = generateUsername(
            provider === 'github' ? profile?.login : name,
            email,
            provider
          );
          const username = await getUniqueUsername(baseUsername);

          existingUser = await User.create({
            username,
            name,
            email,
            image,
            provider,
            providerId,
          });
        } else {
          // Update last active & image
          await User.findByIdAndUpdate(existingUser._id, {
            lastActive: new Date(),
            image,
            name,
          });
        }

        // Attach username to user object for session
        user.username = existingUser.username;
        user.dbId = existingUser._id.toString();
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.dbId = user.dbId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
        session.user.dbId = token.dbId;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // After login redirect to user workspace
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
