import mongoose from 'mongoose';

const MDB_1 = process.env.MDB_1;
const MDB_2 = process.env.MDB_2;

if (!MDB_1) {
  throw new Error('MDB_1 environment variable is not defined');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, uri: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    // Try MDB_1 first
    cached.promise = mongoose
      .connect(MDB_1, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB (Primary - MDB_1)');
        cached.uri = 'MDB_1';
        return mongoose;
      })
      .catch(async (err) => {
        console.warn('⚠️ MDB_1 connection failed:', err.message);

        // Fallback to MDB_2 if available
        if (MDB_2) {
          console.log('🔄 Trying fallback MongoDB (MDB_2)...');
          return mongoose
            .connect(MDB_2, opts)
            .then((mongoose) => {
              console.log('✅ Connected to MongoDB (Fallback - MDB_2)');
              cached.uri = 'MDB_2';
              return mongoose;
            })
            .catch((err2) => {
              console.error('❌ MDB_2 connection also failed:', err2.message);
              throw new Error('Both MongoDB connections failed');
            });
        } else {
          throw new Error(`MongoDB connection failed: ${err.message}`);
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
