import dotenv from 'dotenv';
import app from './app';
import { initializeDatabase } from './database/db';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();