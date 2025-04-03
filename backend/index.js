import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenvenv from 'dotenv';
import connectDB from './utils/db.js';
dotenvenv.config({});
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Job Portal API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});