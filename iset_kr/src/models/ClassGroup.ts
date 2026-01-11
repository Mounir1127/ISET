import mongoose, { Schema, Document } from 'mongoose';

export interface IClassGroup extends Document {
    name: string;
    department: mongoose.Types.ObjectId;
    level: number;
    section: string;
    group?: number;
}

const ClassGroupSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    level: { type: Number, required: true },
    section: { type: String, required: true },
    group: { type: Number }
}, { timestamps: true });

export default mongoose.models['ClassGroup'] || mongoose.model<IClassGroup>('ClassGroup', ClassGroupSchema);
