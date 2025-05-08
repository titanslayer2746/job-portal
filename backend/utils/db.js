import mongoose from 'mongoose';

const connectDB = async()=>{

    try {
        const response = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully", response.connection.host);

    } catch (error) {
        console.log("mogodb error ====> ",error)
    }
}