import express from 'express';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

import './config/database'; 

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
