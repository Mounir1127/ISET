import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
    name: string;
    description?: string;
    fileType: string;
    fileUrl: string;
    size?: string;
    module: mongoose.Types.ObjectId;
    uploadedBy: mongoose.Types.ObjectId;
}

const MaterialSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    fileType: { type: String },
    fileUrl: { type: String, required: true },
    size: { type: String },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models['Material'] || mongoose.model<IMaterial>('Material', MaterialSchema);
