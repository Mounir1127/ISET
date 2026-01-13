
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import Department from '../models/Department';

async function listDepts() {
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI not found');

    await mongoose.connect(uri);
    const depts = await Department.find();
    console.log(JSON.stringify(depts, null, 2));
    await mongoose.disconnect();
}

listDepts().catch(console.error);
