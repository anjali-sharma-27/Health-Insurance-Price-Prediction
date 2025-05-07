import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Connected to database+ ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(error);
        throw new Error("Error connecting to database"); 
    }
}

export default connectDB;