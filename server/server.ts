import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from 'cors';
import claims from './Routes/Claims';
import auth from './Routes/Auth';
connectDB();

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/claims', claims);
app.use('/auth', auth);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
