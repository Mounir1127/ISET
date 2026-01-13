import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    matricule: string;
    password?: string;
    role: 'student' | 'staff' | 'admin' | 'chef';
    status: 'active' | 'pending' | 'inactive';
    phone?: string;
    cin?: string;
    birthDate?: Date;
    gender?: string;
    department?: mongoose.Types.ObjectId;
    classGroup?: mongoose.Types.ObjectId;
    level?: string;
    group?: string;
    grade?: string; // For staff e.g. "Maitre assistant"
    speciality?: string;
    office?: string;
    assignedClasses?: mongoose.Types.ObjectId[];
    subjects?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricule: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'staff', 'admin', 'chef'], default: 'student' },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
    phone: { type: String },
    cin: { type: String },
    birthDate: { type: Date },
    gender: { type: String },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    classGroup: { type: Schema.Types.ObjectId, ref: 'ClassGroup' }, // For students
    level: { type: String },
    group: { type: String },
    grade: { type: String },
    speciality: { type: String },
    office: { type: String },
    assignedClasses: [{ type: Schema.Types.ObjectId, ref: 'ClassGroup' }],
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

export default mongoose.models['User'] || mongoose.model<IUser>('User', UserSchema);
