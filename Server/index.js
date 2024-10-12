import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(cors(
    {
        origin: [process.env.Origin],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'] // Allow necessary headers
    }
)); 

app.use(cookieParser());
app.use(express.json());
app.use( '/api/auth', authRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

mongoose.connect(databaseURL).then(() => {
    console.log('Database connected');
}
).catch((error) => {
    console.log(error);
}
);