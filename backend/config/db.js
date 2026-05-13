import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) =>
      console.error(`MongoDB connection error: ${err.message}`)
    );
    mongoose.connection.on('disconnected', () =>
      console.warn('MongoDB disconnected. Attempting to reconnect...')
    );
  } catch (err) {
    console.error(`MongoDB initial connection failed: ${err.message}`);
    process.exit(1);
  }
};
