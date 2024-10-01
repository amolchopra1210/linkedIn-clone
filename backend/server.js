import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import usersRoutes from './routes/user.route.js';
import postsRoutes from './routes/post.route.js';
import notificationsRoutes from './routes/notification.route.js';
import connectionsRoutes from './routes/connection.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({limit: '5mb'}));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/connections", connectionsRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
})
