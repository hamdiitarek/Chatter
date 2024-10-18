import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import { verifyToken } from "./middleware/AuthMiddleware.js";

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
app.use("/upload/profile", express.static("upload/profile"));
app.use("/upload/files", express.static("upload/files"));
app.use("/api/auth", authRoutes);
app.use("/api/contacts", verifyToken, contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", verifyToken, channelRoutes);


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

setupSocket(server);


mongoose.connect(databaseURL).then(() => {
    console.log('Database connected');
}
).catch((error) => {
    console.log(error);
}
);