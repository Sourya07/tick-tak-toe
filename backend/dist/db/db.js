import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
const userSchema = new mongoose.Schema({
    name: String,
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\S+@\S+\.\S+$/,
            "Please use a valid email address"
        ]
    },
});
const User = mongoose.model('User', userSchema);
export { User, connectDB };
//# sourceMappingURL=db.js.map