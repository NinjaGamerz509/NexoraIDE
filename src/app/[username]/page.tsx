import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WorkspaceClient from './WorkspaceClient';

export default async function WorkspacePage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  if (session.user.username !== params.username) {
    redirect(`/${session.user.username}`);
  }

  return <WorkspaceClient session={session} username={params.username} />;
}
