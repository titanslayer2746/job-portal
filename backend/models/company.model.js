import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    logo: {
        type: String,
        default: ''
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, { timestamps: true });           

export const Company = mongoose.model('Company', companySchema);    