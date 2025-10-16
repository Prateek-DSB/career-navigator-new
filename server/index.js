// Main server file for AI Career Navigator

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import careerRoutes from './routes/career.js';
import { initializeVectorStores } from './langchain/vectorStore.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'https://career-navigator-new.vercel.app',
  'https://career-navigator-new-prateeks-projects-93ce24ff.vercel.app' // Your Vercel deployment URL
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/career', careerRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Career Navigator API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/career/health',
      analyze: 'POST /api/career/analyze',
      courses: 'POST /api/career/courses',
      salary: 'GET /api/career/salary/:role'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('\n🚀 Starting AI Career Navigator Server...\n');
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    
    console.log('✓ OpenAI API key found');
    
    // Initialize vector stores (this may take a minute on first run)
    console.log('\n📚 Initializing vector stores...');
    await initializeVectorStores();
    console.log('✓ Vector stores initialized\n');
    
    // Start server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API Base: http://localhost:${PORT}/api/career`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Ready to help users navigate their careers! 🎯\n');
    });
    
  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('\nPlease check:');
    console.error('1. OPENAI_API_KEY is set in .env file');
    console.error('2. Data files exist in ./data/ directory');
    console.error('3. All npm dependencies are installed\n');
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 Server stopped by user');
  process.exit(0);
});

// Start the server
startServer();