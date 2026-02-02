import express from 'express';
import cors from 'cors';
import path from 'path';
import contactRoutes from './routes/contact.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Contact Management API is running' });
});

// Error handling middleware
app.use(errorHandler);

export default app;