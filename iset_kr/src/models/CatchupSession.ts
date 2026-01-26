import mongoose, { Schema, Document } from 'mongoose';

export interface ICatchupSession extends Document {
    classGroup: mongoose.Types.ObjectId;
    subject: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    room: string;
    status: 'published' | 'draft' | 'cancelled';
    description?: string;
}

const CatchupSessionSchema: Schema = new Schema({
    classGroup: { type: Schema.Types.ObjectId, ref: 'ClassGroup', required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, required: true },
    status: {
        type: String,
        enum: ['published', 'draft', 'cancelled'],
        default: 'published'
    },
    description: { type: String }
}, { timestamps: true });

export default mongoose.models['CatchupSession'] || mongoose.model<ICatchupSession>('CatchupSession', CatchupSessionSchema);
