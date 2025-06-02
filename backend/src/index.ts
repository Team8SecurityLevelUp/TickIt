import * as express from 'express';
import userRoutes from './routes/userRoutes';
import './config/database'; 

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(3000, () => console.log('Server running'));
