
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import User from '../models/User';
import Department from '../models/Department';

async function seedStaff() {
    console.log('CWD:', process.cwd());
    const envPath = join(process.cwd(), '.env');
    console.log('Attempting to load env from:', envPath);
    dotenv.config({ path: envPath });

    // Debug: list all env keys to see if anything loaded
    console.log('Env keys loaded:', Object.keys(process.env).filter(k => k.includes('MONGO')));

    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) {
        // Fallback for debugging: try to read file directly if dotenv fails
        console.error('MONGO_URI not found via dotenv. Checking file directly...');
        try {
            const fs = require('fs');
            const content = fs.readFileSync(envPath, 'utf8');
            console.log('File content length:', content.length);
            const match = content.match(/MONGO_URI=(.*)/);
            if (match) {
                console.log('Found URI manually in file');
                process.env['MONGO_URI'] = match[1].trim();
            }
        } catch (e) {
            console.error('Manual read failed:', e);
        }
    }

    const finalUri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!finalUri) throw new Error('MONGO_URI or MONGODB_URI not found after all attempts');

    await mongoose.connect(finalUri);
    console.log('Connected to MongoDB');

    // Find Departments
    const tiDept = await Department.findOne({ $or: [{ code: 'TI' }, { name: /Informatique/i }, { name: /TI/i }] });
    const gestionDept = await Department.findOne({ $or: [{ code: 'GEST' }, { name: /Gestion/i }] });

    if (!tiDept || !gestionDept) {
        console.error('Departments not found. TI:', !!tiDept, 'Gestion:', !!gestionDept);
        // List all for debug
        const all = await Department.find();
        console.log('Available Depts:', all.map(d => `${d.code}: ${d.name}`));
        await mongoose.disconnect();
        return;
    }

    const staffData = [
        {
            name: 'Hiba Khalil',
            email: 'hiba.khalil@iset.tn',
            matricule: 'STAFF_HIBA',
            role: 'staff',
            status: 'active',
            department: tiDept._id,
            speciality: 'Informatique',
            grade: 'Enseignant'
        },
        {
            name: 'Kawthar Mtawaa',
            email: 'kawthar.mtawaa@iset.tn',
            matricule: 'STAFF_KAWTHAR',
            role: 'chef',
            status: 'active',
            department: tiDept._id,
            speciality: 'Informatique',
            grade: 'Chef de Département'
        },
        {
            name: 'Nabil Mrabat',
            email: 'nabil.mrabat@iset.tn',
            matricule: 'STAFF_NABIL',
            role: 'staff',
            status: 'active',
            department: gestionDept._id,
            speciality: 'Qualité',
            grade: 'Directeur ISET'
        },
        {
            name: 'Maher Ibdeli',
            email: 'maher.ibdeli@iset.tn',
            matricule: 'STAFF_MAHER',
            role: 'staff',
            status: 'active',
            department: tiDept._id,
            speciality: 'Informatique',
            grade: 'Enseignant'
        },
        {
            name: 'Chokri ouertani',
            email: 'chokri.ouertani@iset.tn',
            matricule: 'STAFF_CHOKRI',
            role: 'chef',
            status: 'active',
            department: gestionDept._id,
            speciality: 'Economie et Gestion',
            grade: 'Chef de Département'
        }
    ];

    for (const data of staffData) {
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            console.log(`User ${data.name} already exists. Updating...`);
            await User.findByIdAndUpdate(existing._id, data);
        } else {
            console.log(`Creating user ${data.name}...`);
            await User.create({ ...data, password: 'User@123' }); // Default password
        }
    }

    // Update Head of Department for TI and Gestion
    await Department.findByIdAndUpdate(tiDept._id, { headOfDepartment: (await User.findOne({ email: 'kawthar.mtawaa@iset.tn' }))?._id });
    await Department.findByIdAndUpdate(gestionDept._id, { headOfDepartment: (await User.findOne({ email: 'chokri.ouertani@iset.tn' }))?._id });

    console.log('Staff seeding completed successfully.');
    await mongoose.disconnect();
}

seedStaff().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
