import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
    name: string;
    code: string;
    credits: number;
    coefficient: number;
    department: mongoose.Types.ObjectId;
    semester?: number;
}

const ModuleSchema: Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    coefficient: { type: Number, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number }
}, { timestamps: true });

export default mongoose.models['Module'] || mongoose.model<IModule>('Module', ModuleSchema);
