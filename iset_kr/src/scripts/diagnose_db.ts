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
        console.log('--- DB DIAGNOSTIC ---');

        const depts = await Department.find({});
        console.log('Total Departments:', depts.length);

        for (const d of depts) {
            const teacherCount = await User.countDocuments({ department: d._id, role: 'staff' });
            console.log(`Dept: [${d.name}] | Code: [${d.code}] | ID: ${d._id} | Teachers: ${teacherCount}`);
        }

        console.log('\n--- SLUG TEST ---');
        const testSlugs = ['technologie-informatique', 'genie-electrique', 'genie-mecanique', 'administration-des-affaires', 'gestion', 'GESTION'];

        for (const slug of testSlugs) {
            let foundByCode = await Department.findOne({ code: { $regex: new RegExp('^' + slug + '$', 'i') } });
            console.log(`Slug: [${slug}] | Found by exact code: ${foundByCode ? 'YES (' + foundByCode.name + ')' : 'NO'}`);

            const slugMap: { [key: string]: string } = {
                'technologie-informatique': 'TI',
                'genie-electrique': 'GE',
                'genie-mecanique': 'GM',
                'administration-des-affaires': 'AA',
                'gestion': 'AA',
                'gestion': 'AA'
            };
            const mapped = slugMap[slug.toLowerCase()];
            if (mapped) {
                let foundByMapped = await Department.findOne({ code: { $regex: new RegExp('^' + mapped + '$', 'i') } });
                console.log(`  Mapped to [${mapped}] | Found by code: ${foundByMapped ? 'YES (' + foundByMapped.name + ')' : 'NO'}`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
