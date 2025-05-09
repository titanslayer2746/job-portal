import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import {connectDB} from './utils/db.js';
dotenv.config({});
const app = express();


//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:5173',
    crcedentials: true
}
app.use(cors(corsOptions))


app.use("/api/v1/user", userRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`);
})