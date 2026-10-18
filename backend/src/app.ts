import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';
import notificationRoutes from './routes/notification.routes';
import fileRoutes from './routes/file.routes';
import searchRoutes from './routes/search.routes';
import analyticsRoutes from './routes/analytics.routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check (unversioned, for infrastructure probes)
app.use('/health', healthRoutes);

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Version router pattern.
 *
 * Each supported API version is mounted independently under its own router so
 * that new versions (e.g. /api/v2) can be introduced without touching or
 * breaking existing clients. To add a new version:
 *   1. Create a router (e.g. `apiV2Router`) that mounts the v2 route modules.
 *   2. Mount it below with `app.use('/api/v2', apiV2Router)`.
 *   3. Update the OpenAPI spec base path(s) accordingly.
 */
const apiV1Router = express.Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', userRoutes);
apiV1Router.use('/projects', projectRoutes);
apiV1Router.use('/tasks', taskRoutes);
apiV1Router.use('/comments', commentRoutes);
apiV1Router.use('/notifications', notificationRoutes);
apiV1Router.use('/files', fileRoutes);
apiV1Router.use('/search', searchRoutes);
apiV1Router.use('/analytics', analyticsRoutes);

// Mount versioned API routers
app.use('/api/v1', apiV1Router);

// Requests to /api without a version should point clients to the versioned path
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API version required. Please use a versioned path, e.g. /api/v1${req.path === '/' ? '' : req.path}`,
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
