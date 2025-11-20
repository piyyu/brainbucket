import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String },
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});


const content = mongoose.model("Content", contentSchema);

export default content;