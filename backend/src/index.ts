import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
