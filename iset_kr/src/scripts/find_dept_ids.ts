
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import Department from '../models/Department';

async function findIds() {
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI not found');

    await mongoose.connect(uri);
    const ti = await Department.findOne({ $or: [{ code: 'TI' }, { name: 'Informatique' }, { name: /Informatique/i }] });
    const gestion = await Department.findOne({ $or: [{ code: 'GEST' }, { name: 'Gestion' }, { name: /Gestion/i }] });

    console.log('TI ID:', ti?._id);
    console.log('TI Code:', ti?.code);
    console.log('Gestion ID:', gestion?._id);
    console.log('Gestion Code:', gestion?.code);

    await mongoose.disconnect();
}

findIds().catch(console.error);
