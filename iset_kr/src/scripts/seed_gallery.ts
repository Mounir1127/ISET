import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { readdirSync } from 'fs';
import GalleryImage from '../models/GalleryImage';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const mongodbUri = process.env['MONGODB_URI'] || process.env['MONGO_URI'] || 'mongodb://localhost:27017/iset_kr';

const seedGallery = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongodbUri);
        console.log('✅ Connected.');

        const imagesDir = join(process.cwd(), 'src/assets/images/vie_etudiants');
        const files = readdirSync(imagesDir);

        console.log(`Found ${files.length} images in ${imagesDir}`);

        let addedCount = 0;

        for (const file of files) {
            // Check if valid image
            if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

            // Check if already exists
            const existing = await GalleryImage.findOne({ url: `assets/images/vie_etudiants/${file}` });
            if (existing) {
                // console.log(`Skipping ${file} (already exists)`);
                continue;
            }

            const newImage = new GalleryImage({
                url: `assets/images/vie_etudiants/${file}`,
                category: 'student_life',
                caption: 'Vie Universitaire ISET Kairouan'
            });

            await newImage.save();
            // console.log(`Added ${file}`);
            addedCount++;
        }

        console.log(`✅ Seeding complete. Added ${addedCount} new images.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding gallery:', error);
        process.exit(1);
    }
};

seedGallery();
