import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
    code: string;
    description?: string;
    headOfDepartment?: mongoose.Types.ObjectId;
}

const DepartmentSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    headOfDepartment: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models['Department'] || mongoose.model<IDepartment>('Department', DepartmentSchema);
