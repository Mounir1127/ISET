import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr';

async function run() {
    try {
        await mongoose.connect(mongodbUri);
        console.log('--- DEEP RELATIONSHIP DIAGNOSTIC ---');

        const depts = await Department.find({});
        console.log('Total Departments found:', depts.length);

        for (const d of depts) {
            console.log(`\nDEPARTMENT: [${d.name}] | CODE: [${d.code}] | ID: ${d._id}`);
            const teachers = await User.find({ department: d._id, role: 'staff' });
            console.log(`  Count: ${teachers.length} teachers`);
            if (teachers.length > 0) {
                console.log(`  First 3 teachers specialists: ${teachers.slice(0, 3).map(t => t.name + ' (' + t.speciality + ')').join(', ')}`);
            }
        }

        console.log('\n--- UNASSIGNED OR INVALID DEPT TEACHERS ---');
        const allStaff = await User.find({ role: 'staff' });
        let unassigned = 0;
        let invalid = 0;
        for (const s of allStaff) {
            if (!s.department) {
                unassigned++;
            } else {
                const check = await Department.findById(s.department);
                if (!check) invalid++;
            }
        }
        console.log(`Total Staff: ${allStaff.length}`);
        console.log(`Unassigned: ${unassigned}`);
        console.log(`Invalid Dept ID: ${invalid}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
