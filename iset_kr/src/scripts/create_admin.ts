import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import User from '../models/User';

async function createAdmin() {
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const adminData = {
        name: 'Super Admin ISET',
        email: 'admin@isetk.rnu.tn',
        matricule: 'ADMIN2026',
        password: 'AdminPassword123!',
        role: 'admin',
        status: 'active'
    };

    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
        console.log('Admin user already exists.');
    } else {
        await User.create(adminData);
        console.log('Admin user created successfully!');
    }

    await mongoose.disconnect();
}

createAdmin().catch(console.error);
