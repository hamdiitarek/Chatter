import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Change to bcryptjs

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    firstName: {
        type: String,
        required: true,
        trim: false
    },
    lastName: {
        type: String,
        required: true,
        trim: false
    },
    profilePic: {
        type: String,
        default: ''
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
});

// // Hash password before saving the user
// userSchema.pre('save', async function(next) {
//     if (this.isModified('password')) {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//     }
//     next();
// });

const User = mongoose.model('User', userSchema);

export default User;
