
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Announcement from '../models/Announcement';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr_db';

async function seedManifestation() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const manifestation = {
            title: 'Journée Portes Ouvertes 2026',
            type: 'event', // Important: must be 'event'
            status: 'published',
            description: 'Découvrez nos formations et nos clubs lors de cette journée exceptionnelle.',
            content: 'Une occasion unique de rencontrer nos enseignants et étudiants, visiter les laboratoires et découvrir la vie associative.',
            publishDate: new Date(),
            startDate: new Date('2026-03-15'),
            location: 'Campus ISET Kairouan',
            organizer: 'Direction & Clubs',
            image: 'assets/images/images_iset/Image8.jpg'
        };

        await Announcement.create(manifestation);
        console.log('✅ Manifestation seeded successfully:', manifestation.title);

    } catch (error) {
        console.error('❌ Error seeding manifestation:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

seedManifestation();
