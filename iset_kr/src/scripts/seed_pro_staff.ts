
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
    const gestionDept = await Department.findOne({ $or: [{ code: 'GESTION' }, { name: /Gestion/i }] });
    const geDept = await Department.findOne({ $or: [{ code: 'GE' }, { name: /Electrique/i }] });
    const gmDept = await Department.findOne({ $or: [{ code: 'GM' }, { name: /Mecanique/i }] });

    if (!tiDept || !gestionDept || !geDept || !gmDept) {
        console.error('Some departments not found. TI:', !!tiDept, 'Gestion:', !!gestionDept, 'GE:', !!geDept, 'GM:', !!gmDept);
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
            grade: 'Chef de Département',
            bio: 'Notre mission est de doter nos étudiants des compétences techniques et humaines nécessaires pour exceller dans un secteur en perpétuelle évolution.',
            profileImage: 'assets/images/staff/generic-avatar.png'
        },
        {
            name: 'Chokri Ouertani',
            email: 'chokri.ouertani@iset.tn',
            matricule: 'STAFF_CHOKRI',
            role: 'chef',
            status: 'active',
            department: gestionDept._id,
            speciality: 'Economie et Gestion',
            grade: 'Chef de Département',
            bio: 'Comprendre l\'économie pour mieux gérer l\'entreprise de demain est notre devise.',
            profileImage: 'assets/images/staff/generic-avatar.png'
        },
        {
            name: 'Mourad SELMI',
            email: 'mourad.selmi@iset.tn',
            matricule: 'STAFF_MOURAD',
            role: 'chef',
            status: 'active',
            department: geDept._id,
            speciality: 'Génie Électrique',
            grade: 'Chef de Département',
            bio: 'L\'innovation et la pratique sont au cœur de notre pédagogie pour former les ingénieurs de demain.',
            profileImage: 'assets/images/staff/generic-avatar.png'
        },
        {
            name: 'Nizar Ouni',
            email: 'nizar.ouni@iset.tn',
            matricule: 'STAFF_NIZAR',
            role: 'chef',
            status: 'active',
            department: gmDept._id,
            speciality: 'Génie Mécanique',
            grade: 'Chef de Département',
            bio: 'Nous formons des techniciens capables de transformer une idée en un produit tangible et fonctionnel.',
            profileImage: 'assets/images/staff/generic-avatar.png'
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

    // Update Head of Department for all departments
    await Department.findByIdAndUpdate(tiDept._id, { headOfDepartment: (await User.findOne({ email: 'kawthar.mtawaa@iset.tn' }))?._id });
    await Department.findByIdAndUpdate(gestionDept._id, { headOfDepartment: (await User.findOne({ email: 'chokri.ouertani@iset.tn' }))?._id });
    await Department.findByIdAndUpdate(geDept._id, { headOfDepartment: (await User.findOne({ email: 'mourad.selmi@iset.tn' }))?._id });
    await Department.findByIdAndUpdate(gmDept._id, { headOfDepartment: (await User.findOne({ email: 'nizar.ouni@iset.tn' }))?._id });

    console.log('Staff seeding completed successfully.');
    await mongoose.disconnect();
}

seedStaff().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
