import mongoose from 'mongoose';
import User from '../models/User';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/iset_kr';

async function run() {
    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');

        const adminData = {
            name: 'Administrateur',
            email: 'admin@isetkr.tn',
            matricule: 'ADMIN2026',
            password: 'AdminPassword123!',
            role: 'admin',
            status: 'active'
        };

        const existing = await User.findOne({ matricule: 'ADMIN2026' });
        if (existing) {
            console.log('Admin already exists, updating...');
            await User.updateOne({ matricule: 'ADMIN2026' }, adminData);
        } else {
            await User.create(adminData);
            console.log('Admin user created successfully');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
}

run();
