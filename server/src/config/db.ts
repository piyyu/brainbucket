import mongoose from "mongoose";

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDb connected");
    } catch (err) {
        console.error("DB connection error: ", err);
    }
}

export default connectDb;