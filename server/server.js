import express from 'express';
import { urlencoded } from 'express';
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser';
import { connectdb } from './config/database.js';
import login from './routes/login.js'
import setup from './routes/setup.js'
import service from './routes/service.js'
import { validate_token } from '../../AskNeighbour/server/middleware/validate_token.js';


const app = express()

const port = process.env.PORT || 9000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS','PATCH','DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // The front-end URL
    credentials: true               // Allow credentials (cookies)
}));

app.use('/uploads', express.static(path.join(import.meta.dirname, 'uploads')));

app.use(cookieParser());

app.use(express.json());

app.use(urlencoded({ extended: false }))

connectdb();

app.use('/ask_neigh/login',login)

app.use('/ask_neigh/setup',validate_token,setup)

app.use('/ask_neigh/service',validate_token,service)

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
})
