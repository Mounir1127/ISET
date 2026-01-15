import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import User from '../models/User';
import Department from '../models/Department';

async function fixHod() {
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find Gestion Dept
    const gestionDept = await Department.findOne({ $or: [{ code: 'GEST' }, { name: /Gestion/i }] });
    if (!gestionDept) {
        console.error('Gestion department not found');
        await mongoose.disconnect();
        return;
    }

    // Find or Create Chokri
    let chokri = await User.findOne({ name: /Chokri/i });
    if (!chokri) {
        console.log('Chokri not found, creating...');
        chokri = await User.create({
            name: 'Chokri Ouertani',
            email: 'chokri.ouertani@iset.tn',
            matricule: 'STAFF_CHOKRI',
            role: 'chef',
            status: 'active',
            department: gestionDept._id,
            grade: 'Chef de Département'
        });
    } else {
        console.log('Found Chokri:', chokri.name);
    }

    // Update Dept
    await Department.findByIdAndUpdate(gestionDept._id, { headOfDepartment: chokri._id });
    console.log(`Updated ${gestionDept.name} HOD to ${chokri.name}`);

    await mongoose.disconnect();
}

fixHod().catch(console.error);
