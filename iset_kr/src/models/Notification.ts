import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    title: string;
    message: string;
    read: boolean;
    type?: string;
}

const NotificationSchema: Schema = new Schema({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String }
}, { timestamps: true });

export default mongoose.models['Notification'] || mongoose.model<INotification>('Notification', NotificationSchema);
