import mongoose from 'mongoose';

const bkashSchema = new mongoose.Schema({
    auth_token: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Bkash = mongoose.models.Bkash || mongoose.model('Bkash', bkashSchema);
export default Bkash;