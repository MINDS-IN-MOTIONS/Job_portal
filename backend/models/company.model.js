import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensure company names are unique
    },
    description: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    industry: {
        type: String,
        required: false,
    },
    website: {
        type: String,
        required: false,
    },
    logo: {
        type: String, // url to the logo image
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to the User model
        required: true,
    },
}, { timestamps: true });

export  const Company = mongoose.model('Company', companySchema);
export default Company;