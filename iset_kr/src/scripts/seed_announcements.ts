
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import Announcement from '../models/Announcement';

async function seedAnnouncements() {
    // 1. Load Env
    dotenv.config({ path: join(process.cwd(), '.env') });
    const uri = process.env['MONGO_URI'] || process.env['MONGODB_URI'];
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI not found');

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    // 2. Data
    const announcements = [
        {
            type: 'event',
            title: 'Journée Portes Ouvertes 2026',
            arabicText: 'اليوم المفتوح 2026',
            status: 'published',
            publishDate: new Date(),
            priority: 'high',
            image: '/uploads/open_day.png',
            description: 'Venez découvrir nos filières, nos laboratoires et discuter avec nos enseignants.',
            eventType: 'Journée d\'accueil',
            startDate: new Date('2026-02-15T09:00:00'),
            location: 'Campus ISET Kairouan',
            targetAudience: ['futurs bacheliers', 'parents'],
            organizer: 'Direction des Etudes'
        },
        {
            type: 'news',
            title: 'Nouveaux équipements pour le labo TI',
            arabicText: 'تجهيزات جديدة لمخبر تكنولوجيا المعلومات',
            status: 'published',
            publishDate: new Date(),
            priority: 'medium',
            image: '/uploads/ti_lab.png',
            summary: 'L\'ISET Kairouan vient de recevoir 30 nouveaux PC haute performance pour le département Informatique.',
            content: 'Dans le cadre de l\'amélioration de l\'infrastructure pédagogique, le département TI a été doté de nouveaux équipements modernisant ainsi nos capacités de formation pratique.',
            category: 'Infrastructure',
            author: 'Cellule Com'
        },
        {
            type: 'tender',
            title: 'Appel d\'offres : Aménagement du foyer',
            arabicText: 'طلب عروض: تهيئة المبيت',
            status: 'published',
            publishDate: new Date(),
            priority: 'low',
            image: '/uploads/tender.png',
            issuer: 'Ministère de l\'Enseignement Supérieur',
            deadline: new Date('2026-01-30'),
            reference: 'AO/ISETK/2026/01',
            contact: 'contact@isetk.tn'
        },
        {
            type: 'exam',
            title: 'Calendrier des DS - Semestre 1',
            arabicText: 'جدول امتحانات المراقبة - السداسي الأول',
            status: 'published',
            publishDate: new Date(),
            priority: 'high',
            image: '/uploads/exam.png',
            description: 'Les examens de contrôle continu débuteront le 20 Janvier.',
            targetAudience: ['Tous les étudiants']
        }
    ];

    // 3. Insert
    console.log('Cleaning existing announcements...');
    await Announcement.deleteMany({});

    console.log(`Seeding ${announcements.length} announcements...`);
    for (const data of announcements) {
        await Announcement.create(data);
        console.log(`Created: ${data.title}`);
    }

    // 4. Close
    await mongoose.disconnect();
    console.log('Done.');
}

seedAnnouncements().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
