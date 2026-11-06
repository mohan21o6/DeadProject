/**
 * MongoDB Connection and Collection Adapter
 * Connects to MongoDB when MONGODB_URI is provided in environment variables;
 * falls back cleanly to local persisted JSON store if MongoDB is not running.
 */

let isConnected = false;

export async function connectMongo(uri?: string): Promise<any> {
  const connectionUri = uri || process.env.MONGODB_URI;
  if (!connectionUri) {
    console.log('[DeadProject] No MONGODB_URI found; operating with local storage adapter.');
    return null;
  }
  try {
    console.log('[DeadProject] Attempting MongoDB connection...');
    // Use dynamic import for optional driver
    const mongoModule: any = await (Function('return import("mongodb")')().catch(() => null));
    if (!mongoModule || !mongoModule.MongoClient) {
      console.log('[DeadProject] Optional driver "mongodb" not installed; using local data adapter.');
      return null;
    }
    const client = new mongoModule.MongoClient(connectionUri, { connectTimeoutMS: 3000 });
    await client.connect();
    isConnected = true;
    console.log('[DeadProject] Connected successfully to MongoDB.');
    return client.db(process.env.MONGODB_DB_NAME || 'deadproject');
  } catch (err: any) {
    console.warn('[DeadProject] MongoDB connection bypassed (running local adapter):', err.message);
    return null;
  }
}

export function isMongoConnected(): boolean {
  return isConnected;
}
