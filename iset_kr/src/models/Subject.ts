import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
    name: string;
    code?: string;
    department?: mongoose.Types.ObjectId;
}

const SubjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String },
    department: { type: Schema.Types.ObjectId, ref: 'Department' }
}, { timestamps: true });

export default mongoose.models['Subject'] || mongoose.model<ISubject>('Subject', SubjectSchema);
