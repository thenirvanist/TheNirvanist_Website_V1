// Netlify Functions wrapper for Express server
import serverlessExpress from '@netlify/functions/express';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

const app = express();

// Setup Express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

// Export the handler for Netlify Functions
export const handler = serverlessExpress(app);