import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvenv from 'dotenv';
import connectDB from './utils/db.js';
dotenvenv.config({});
const app = express();
import userRoutes from './routes/user.route.js';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

// Start the server
const PORT = process.env.PORT || 3000;

// API's
app.use('/api/v1/user', userRoutes);
http://localhost:8000/api/v1/user/register


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});