
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../src/models/Subject';

dotenv.config();

const check = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Connecting to DB...');
        await mongoose.connect(uri as string);
        const count = await Subject.countDocuments();
        console.log(`SUBJECT_COUNT: ${count}`);
        if (count > 0) {
            const sample = await Subject.findOne();
            console.log(`SAMPLE_SUBJECT: ${sample?.name}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};
check();
