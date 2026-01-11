import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
    module: mongoose.Types.ObjectId;
    subject?: mongoose.Types.ObjectId;
    classGroup: mongoose.Types.ObjectId;
    staff: mongoose.Types.ObjectId;
    day: string;
    startTime: string;
    room?: string;
    endTime?: string;
}

const ScheduleSchema: Schema = new Schema({
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    classGroup: { type: Schema.Types.ObjectId, ref: 'ClassGroup', required: true },
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String }, // Optional
    room: { type: String }
}, { timestamps: true });

export default mongoose.models['Schedule'] || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
