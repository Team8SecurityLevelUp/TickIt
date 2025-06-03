import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

import './config/database'; 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
