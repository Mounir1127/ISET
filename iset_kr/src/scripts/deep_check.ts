import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

async function run() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log('Connecting to DB...');
        await mongoose.connect(mongoUri!);

        // Use raw connection to avoid model registration issues for this check
        const users = await mongoose.connection.collection('users').find({
            role: { $in: ['staff', 'chef'] }
        }).toArray();

        const depts = await mongoose.connection.collection('departments').find({}).toArray();
        const deptMap = new Map();
        depts.forEach(d => deptMap.set(d._id.toString(), d.name));

        const report = users.map(u => ({
            name: u.name,
            role: u.role,
            deptId: u.department ? u.department.toString() : 'MISSING',
            deptName: u.department ? deptMap.get(u.department.toString()) || 'NOT_FOUND_IN_DEPTS' : 'MISSING',
            profileImage: u.profileImage || 'NONE'
        }));

        fs.writeFileSync('teacher_report.json', JSON.stringify(report, null, 2));
        console.log(`Report for ${users.length} teachers saved to teacher_report.json`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
