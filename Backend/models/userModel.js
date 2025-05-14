import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isMFAEnabled: {
        type: Boolean,
        default: false
    },
    // Store the secret key
    mfaSecret: {
        type: String
    },
});

export const User = mongoose.model('User', userSchema);