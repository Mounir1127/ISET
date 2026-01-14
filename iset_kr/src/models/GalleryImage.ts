import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage extends Document {
    url: string;
    caption?: string;
    category: string;
    createdAt: Date;
}

const GalleryImageSchema: Schema = new Schema({
    url: { type: String, required: true },
    caption: { type: String },
    category: { type: String, default: 'student_life' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
