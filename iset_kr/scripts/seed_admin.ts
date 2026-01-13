
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) throw new Error('No URI found');

        console.log('Connecting to DB...');
        await mongoose.connect(uri as string);

        const adminMatricule = 'ADMIN001';
        const existingAdmin = await User.findOne({ matricule: adminMatricule });

        if (existingAdmin) {
            console.log('✅ Admin user already exists.');
        } else {
            console.log('Creating Admin user...');
            const hashedPassword = bcrypt.hashSync('password_admin_2024', 10);

            await User.create({
                name: 'Administrateur Principal',
                email: 'admin@isetkr.tn',
                matricule: adminMatricule,
                password: hashedPassword,
                role: 'admin',
                status: 'active',
                phone: '00000000',
                cin: '00000000',
                birthDate: new Date('2000-01-01'),
                gender: 'homme'
            });
            console.log('✅ Admin user created successfully.');
        }

    } catch (e: any) {
        console.error('❌ Error:', e.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
