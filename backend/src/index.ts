import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import teamRoutes from './routes/teamRoutes';
import './config/database'; 

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));

app.set('trust proxy', true);
app.use('/api/', limiter);

app.use(express.json());
app.use(cookieParser());

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not set");
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000 // 5 minutes
  }
}));

app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
