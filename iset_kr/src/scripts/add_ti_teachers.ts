import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGO_URI || process.env.MONGODB_URI;

const newTeachers = [
    { name: 'Maher Abdelli', email: 'mabdelli.ing@gmail.com', grade: 'Maitre technologue', speciality: 'TI' },
    { name: 'Habiba Ajili', email: 'ajilihabiba@yahoo.fr', grade: 'Professeur principal émérite', speciality: 'TI' },
    { name: 'Abderrahim Allani', email: 'allani.abderrahim@gmail.com', grade: 'Technologue', speciality: 'TI' },
    { name: 'Samia Ben Abdeljelil', email: 'samya.abdeljelil@gmail.com', grade: 'Maitre technologue', speciality: 'TI' },
    { name: 'Feyza Dhiflaoui', email: 'feyzadhif@hotmail.fr', grade: 'Professeur émérite', speciality: 'TI' },
    { name: 'Marwa Ghzel', email: 'ghzelmarwa@live.com', grade: 'Technologue', speciality: 'TI' },
    { name: 'Maher Habli', email: 'maher22311976@gmail.com', grade: 'Professeur d\'enseignement secondaire', speciality: 'TI' },
    { name: 'Sawsan jemli', email: 'jsawssen@gmail.com', grade: 'Technologue', speciality: 'TI' },
    { name: 'Fatma Kaabi', email: 'kaabihajjifatma@gmail.com', grade: 'Technologue', speciality: 'TI' },
    { name: 'Hiba Khelil', email: 'hibakhelil@gmail.com', grade: 'Technologue', speciality: 'TI' },
    { name: 'Hela Makina', email: 'hela.makina@yahoo.fr', grade: 'Technologue', speciality: 'TI' },
    { name: 'Kawthar Mtawaa', email: 'mtawaa.kawthar@gmail.com', grade: 'Maitre technologue', speciality: 'TI' },
    { name: 'Sonia selmi', email: 'soniaselmiarfaoui@gmail.com', grade: 'Maitre Technologue', speciality: 'TI' },
    { name: 'Mohammed Zarka', email: 'medzarka@gmail.com', grade: 'Maitre technologue', speciality: 'TI' }
];

async function seed() {
    if (!mongodbUri) {
        console.error('MONGO_URI or MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');

        const tiDept = await Department.findOne({ code: 'TI' });
        if (!tiDept) {
            console.error('Department TI not found');
            process.exit(1);
        }

        console.log(`Found Department: ${tiDept.name} (ID: ${tiDept._id})`);

        for (let i = 0; i < newTeachers.length; i++) {
            const t = newTeachers[i];

            // Generate a unique matricule if not existing
            // Using a prefix to distinguish these manually added teachers
            const matricule = `TI_ADD_${(i + 1).toString().padStart(3, '0')}`;

            // Check if user already exists by email
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
                department: tiDept._id,
                grade: t.grade,
                speciality: t.speciality,
                password: 'password123', // Default password as per project convention
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
            });
            console.log(`Created teacher: ${t.name} (${matricule})`);
        }

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding teachers:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
