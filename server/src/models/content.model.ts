import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: false },
    description: { type: String, required: false },
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    embedding: {
        type: [Number],
        default: []
    }

});


const content = mongoose.model("Content", contentSchema);

export default content;