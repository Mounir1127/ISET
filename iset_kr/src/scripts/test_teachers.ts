import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr';

async function test() {
    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected');

        const deptId = 'administration-des-affaires';

        let department;
        if (mongoose.Types.ObjectId.isValid(deptId)) {
            department = await Department.findById(deptId);
        }

        if (!department) {
            department = await Department.findOne({ code: deptId.toUpperCase() });
        }

        if (!department) {
            const slugMap: { [key: string]: string } = {
                'technologie-informatique': 'TI',
                'genie-electrique': 'GE',
                'genie-mecanique': 'GM',
                'administration-des-affaires': 'AA',
                'gestion': 'AA'
            };
            const code = slugMap[deptId.toLowerCase()];
            if (code) {
                department = await Department.findOne({ code });
                console.log('Found by slug mapping:', code);
            }
        }

        if (!department) {
            console.log('Department not found');
            process.exit(0);
        }

        console.log('Using Department:', department.name, department._id);

        const teachers = await User.find({
            department: department._id,
            role: 'staff',
            status: 'active'
        }).select('-password').sort({ name: 1 }).lean();

        console.log('Found teachers count:', teachers.length);
        console.log('Teachers:', teachers.map(t => t.name));

        process.exit(0);
    } catch (error) {
        console.error('Test error:', error);
        process.exit(1);
    }
}

test();
