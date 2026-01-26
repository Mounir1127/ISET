import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    name: string;
    logo: string;
    link?: string;
    type: 'academic' | 'industrial' | 'international';
    createdAt: Date;
}

const PartnerSchema: Schema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true },
    link: { type: String },
    type: { type: String, enum: ['academic', 'industrial', 'international'], required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models['Partner'] || mongoose.model<IPartner>('Partner', PartnerSchema);
