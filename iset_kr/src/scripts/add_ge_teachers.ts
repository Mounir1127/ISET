import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const geTeachers = [
    { name: 'FAKHREDDINE ABBASSI', email: 'abbassifakhr205@gmail.com', grade: 'Professeur principal émérite', speciality: 'GE' },
    { name: 'Samir Arfa', email: 'arfa.samir@gmail.com', grade: 'Maitre Technologue', speciality: 'GE' },
    { name: 'Arafet Bouaicha', email: 'arafet2001it@gmail.com', grade: 'Technologue', speciality: 'GE' },
    { name: 'KAWTHAR CHROUDI', email: 'chroudikawthar@yahoo.fr', grade: 'Technologue', speciality: 'GE' },
    { name: 'NAHLA DEHMANI', email: 'dehmaninahla@gmail.com', grade: 'Technologue', speciality: 'GE' },
    { name: 'Bilel Hadhri', email: 'bilel.hadhri.86@gmail.com', grade: 'Professeur émérite', speciality: 'GE' },
    { name: 'Mondher Hajji', email: 'mondher.hjj@gmail.com', grade: 'Maitre technologue', speciality: 'GE' },
    { name: 'Ihssen Jabri', email: 'ihssen.agengui@gmail.com', grade: 'Technologue', speciality: 'GE' },
    { name: 'Adel Jammali', email: 'jammaliadel@gmail.com', grade: 'Maitre Technologue', speciality: 'GE' },
    { name: 'Imed Jebeniani', email: 'jebeniani.imed@gmail.com', grade: 'Technologue', speciality: 'GE' },
    { name: 'Timoumi Mahdi', email: 'mehditimoumi@gmail.com', grade: 'Maitre technologue', speciality: 'GE' },
    { name: 'Sami Mansour', email: 'mansami2023@gmail.com', grade: 'Maitre technologue', speciality: 'GE' },
    { name: 'Mongi Moujahed', email: 'mongi.moujahed@yahoo.com', grade: 'Maitre technologue', speciality: 'GE' },
    { name: 'Sihem Saideni', email: 'sihem.saidani@yahoo.fr', grade: 'Maitre technologue', speciality: 'GE' },
    { name: 'Mourad Selmi', email: 'selmimourad@yahoo.fr', grade: 'Maitre Technologue', speciality: 'GE' }
];

async function seed() {
    if (!mongodbUri) {
        console.error('MONGO_URI or MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');

        const geDept = await Department.findOne({ code: 'GE' });
        if (!geDept) {
            console.error('Department GE not found');
            process.exit(1);
        }

        console.log(`Found Department: ${geDept.name} (ID: ${geDept._id})`);

        for (let i = 0; i < geTeachers.length; i++) {
            const t = geTeachers[i];

            const matricule = `GE_ADD_${(i + 1).toString().padStart(3, '0')}`;

            const existingUser = await User.findOne({ email: t.email });
            if (existingUser) {
                console.log(`Teacher with email ${t.email} already exists. Skipping.`);
                continue;
            }

            await User.create({
                name: t.name,
                email: t.email,
                matricule: matricule,
                role: 'staff',
                status: 'active',
                department: geDept._id,
                grade: t.grade,
                speciality: t.speciality,
                password: 'password123',
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
            });
            console.log(`Created teacher: ${t.name} (${matricule})`);
        }

        console.log('GE Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding GE teachers:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
