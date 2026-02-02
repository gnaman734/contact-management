import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Removed database initialization
    console.log('Skipping database initialization');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();