import mongoose from 'mongoose';

// Performance optimization: Connection cache
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs_mongodb_dev';

// Cache object for connection reuse
interface Cached {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Initialize cache
const cached: Cached = {
  conn: null,
  promise: null,
};

/**
 * Connect to MongoDB with exponential backoff retry strategy
 * @param uri MongoDB connection string
 * @param options Mongoose connection options
 * @param maxRetries Maximum number of retry attempts (default: 5)
 * @returns Mongoose connection
 */
async function connectWithRetry(
  uri: string, 
  options: mongoose.ConnectOptions, 
  maxRetries: number = 5
): Promise<mongoose.Connection> {
  let retryCount = 0;
  let backoff = 1000; // Start with 1s delay

  while (true) {
    try {
      await mongoose.connect(uri, options);
      const conn = mongoose.connection;
      return conn;
    } catch (error) {
      if (retryCount >= maxRetries) {
        console.error('Failed to connect to MongoDB after multiple retries:', error);
        throw error;
      }

      // Calculate exponential backoff with jitter
      const jitter = Math.random() * 0.3 * backoff;
      const delay = backoff + jitter;
      
      console.log(`MongoDB connection attempt ${retryCount + 1} failed. Retrying in ${delay.toFixed(0)}ms...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff: Double the delay each time, cap at 10s
      backoff = Math.min(backoff * 2, 10000);
      retryCount++;
    }
  }
}

/**
 * Global dbConnect function that caches the database connection
 * for improved performance across serverless function invocations
 */
async function dbConnect(): Promise<mongoose.Connection> {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt is in progress, return the promise
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Connection pool optimization
      maxPoolSize: 10, // Default is 100, reduce for serverless
      minPoolSize: 1,
      socketTimeoutMS: 30000, // Close socket if inactive for 30s
      serverSelectionTimeoutMS: 5000, // Server selection timeout
      // Performance and reliability settings
      connectTimeoutMS: 10000, // Connection attempt timeout
      heartbeatFrequencyMS: 10000, // Check connection health every 10s
    };

    console.log('MongoDB connecting with retry mechanism...');
    cached.promise = connectWithRetry(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;