import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../src/models/Subject';
import Department from '../src/models/Department';
import Module from '../src/models/Module';

dotenv.config();

const verifySubjects = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            console.error('No MongoDB URI found in .env');
            return;
        }
        console.log('Connecting to:', uri.replace(/:([^:@]+)@/, ':****@').split('@')[1]); // Show host only
        await mongoose.connect(uri);
        console.log('Connected.');

        const subjectCount = await Subject.countDocuments();
        const deptCount = await Department.countDocuments();
        const moduleCount = await Module.countDocuments();

        console.log(JSON.stringify({
            departments: deptCount,
            subjects: subjectCount,
            modules: moduleCount,
            sampleSubjects: await Subject.find().limit(5).populate('department').lean()
        }, null, 2));

        await mongoose.disconnect();
    } catch (error: any) {
        console.error('Verification failed:', error.message);
    }
};

verifySubjects();
