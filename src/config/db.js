import mongoose from "mongoose";

export default async function connectDB(dbUrl){
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed", error);
    }
}