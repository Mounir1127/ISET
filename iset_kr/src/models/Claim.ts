import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
    student: mongoose.Types.ObjectId;
    staff?: mongoose.Types.ObjectId;
    module?: mongoose.Types.ObjectId;
    status: 'pending' | 'resolved' | 'rejected';
    title?: string;
    description: string;
}

const ClaimSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staff: { type: Schema.Types.ObjectId, ref: 'User' },
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
    title: { type: String },
    description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models['Claim'] || mongoose.model<IClaim>('Claim', ClaimSchema);
