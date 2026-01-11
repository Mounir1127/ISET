import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    student: mongoose.Types.ObjectId;
    schedule: mongoose.Types.ObjectId;
    status: 'present' | 'absent' | 'late';
    date: Date;
}

const AttendanceSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models['Attendance'] || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
