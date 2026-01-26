import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const gmTeachers = [
    { name: 'Karim Agrebi', email: 'agrebikarim@gmail.com', grade: 'Maitre technologue', speciality: 'GM' },
    { name: 'Houssem amamou', email: 'amamou.houssem@gmail.com', grade: 'Technologue', speciality: 'GM' },
    { name: 'Sassi Arfaoui', email: 'sami_arfaoui@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Imen Bahrini', email: 'bahriniamouna@live.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Khaled Ben Njima', email: 'ben_njima_khaled@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Wissem ben Yehia', email: 'wissembenyahia@gmail.com', grade: 'Technologue', speciality: 'GM' },
    { name: 'Mokhless Boukhris', email: 'mokhlessiset@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Mohamed Boussaadia', email: 'medboussaadia@gmail.com', grade: 'Technologue', speciality: 'GM' },
    { name: 'Hajer Briki', email: 'BRIKI_eya@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Mokhtar Briki', email: 'ibtihel81@gmail.com', grade: 'Professeur émérite', speciality: 'GM' },
    { name: 'Kaouther Chehaibi', email: 'chehaibikaouther@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Hechmi Chermiti', email: 'hechmi.chermiti@gmail.com', grade: 'Maitre technologue', speciality: 'GM' },
    { name: 'Souheil Elgaied', email: 'souheil.elgaied@laposte.net', grade: 'Professeur technologue', speciality: 'GM' },
    { name: 'Hajer Ellouz', email: 'hajer.ellouz@yahoo.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Sawssen Ghannem', email: 'sawsen-ghannem@live.fr', grade: 'Technologue', speciality: 'GM' },
    { name: 'Montasser Billah Letaief', email: 'mb.letaief@gmail.com', grade: 'Maitre technologue', speciality: 'GM' },
    { name: 'Mohamed Ali Maatoug', email: 'ma.maatoug@gmail.com', grade: 'Maitre technologue', speciality: 'GM' },
    { name: 'Nidhal Naat', email: 'naatnidhal@gmail.com', grade: 'Maitre technologue', speciality: 'GM' },
    { name: 'Nizar Ouni', email: 'nizarouni3@gmail.com', grade: 'Technologue', speciality: 'GM' },
    { name: 'Saber Sayeh', email: 'saber.sayeh@gmail.com', grade: 'Technologue', speciality: 'GM' },
    { name: 'Zoubaier Selmi', email: 'szoubaier@yahoo.fr', grade: 'Professeur émérite', speciality: 'GM' }
];

async function seed() {
    if (!mongodbUri) {
        console.error('MONGO_URI or MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');

        const gmDept = await Department.findOne({ code: 'GM' });
        if (!gmDept) {
            console.error('Department GM not found');
            process.exit(1);
        }

        console.log(`Found Department: ${gmDept.name} (ID: ${gmDept._id})`);

        for (let i = 0; i < gmTeachers.length; i++) {
            const t = gmTeachers[i];

            const matricule = `GM_ADD_${(i + 1).toString().padStart(3, '0')}`;

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
                department: gmDept._id,
                grade: t.grade,
                speciality: t.speciality,
                password: 'password123',
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
            });
            console.log(`Created teacher: ${t.name} (${matricule})`);
        }

        console.log('GM Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding GM teachers:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
