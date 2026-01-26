import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri!);
        console.log('Connected.');

        const teachers = await User.find({ role: { $in: ['staff', 'chef'] } }).populate('department');

        const results = teachers.map(t => {
            const obj = t.toObject();
            return {
                name: t.name,
                email: t.email,
                departmentRaw: obj.department,
                departmentName: (t.department as any)?.name,
                profileImage: t.profileImage
            };
        });

        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
