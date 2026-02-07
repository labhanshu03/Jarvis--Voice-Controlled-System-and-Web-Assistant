import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
        default: "Assistant"
    },
    assistantImage: {
        type: String,
        default: "https://res.cloudinary.com/daprjfpk3/image/upload/v1728032549/image4_nkyvuj.png"
    },
    history: {
        type: Array, // Could be specialized more if we knew structure
        default: []
    }
}, { timestamps: true });

// Prevent overwrite model error
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
