import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';
import Partner from '../models/Partner';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const seedPartners = async () => {
    try {
        const mongoUri = process.env['MONGODB_URI'];
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing partners to avoid duplicates or inconsistent state during seed
        await Partner.deleteMany({});
        console.log('Cleared existing partners');

        const internationalPartners = [
            { name: 'AUF', logo: 'assets/images/nos_parteners/AUF.png', type: 'international' },
            { name: 'KOICA', logo: 'assets/images/nos_parteners/KOICA.png', type: 'international' },
            { name: 'PNUD', logo: 'assets/images/nos_parteners/UNDP.png', type: 'international' },
            { name: 'AFD', logo: 'assets/images/nos_parteners/AFD.jpg', type: 'international' }
        ];

        const academicPartners = [
            { name: 'Université de Kairouan', logo: 'assets/images/nos_parteners/Université%20de%20Kairouan.png', type: 'academic' },
            { name: 'Canada', logo: 'assets/images/nos_parteners/canada.png', type: 'academic' },
            { name: 'CNFCPP', logo: 'assets/images/nos_parteners/CNFCPP.png', type: 'academic' },
            { name: 'CNFCCP', logo: 'assets/images/nos_parteners/CNFCCP.jpg', type: 'academic' },
            { name: 'ESPITA', logo: 'assets/images/nos_parteners/ESPITA.jpg', type: 'academic' },
            { name: 'IHE Sousse', logo: 'assets/images/nos_parteners/ihesousse_logo.jpg', type: 'academic' },
            { name: 'ASH', logo: 'assets/images/nos_parteners/ASH.jpg', type: 'academic' },
            { name: 'Jannet', logo: 'assets/images/nos_parteners/Jannet.jpg', type: 'academic' },
            { name: 'MTK', logo: 'assets/images/nos_parteners/MTK.jpg', type: 'academic' }
        ];

        const industrialPartners = [
            { name: 'Orange Digital Center', logo: 'assets/images/nos_parteners/orange.png', link: 'https://engageforchange.orange.com', type: 'industrial' },
            { name: '4C ISET Kairouan', logo: 'assets/images/nos_parteners/4C.png', type: 'industrial' },
            { name: 'GoMyCode', logo: 'assets/images/nos_parteners/GomyCode.png', type: 'industrial' },
            { name: 'JCI Kairouan', logo: 'assets/images/nos_parteners/jci_kr.jpg', type: 'industrial' },
            { name: 'ANME', logo: 'assets/images/nos_parteners/ANME.jpg', type: 'industrial' },
            { name: 'APII', logo: 'assets/images/nos_parteners/APII.png', type: 'industrial' },
            { name: 'UTICA', logo: 'assets/images/nos_parteners/Logo_UTICA.gif', type: 'industrial' },
            { name: 'Landor', logo: 'assets/images/nos_parteners/LANDOR.jpg', type: 'industrial' },
            { name: 'Sabrine', logo: 'assets/images/nos_parteners/Sabrine.jpg', type: 'industrial' },
            { name: 'Vizmerald', logo: 'assets/images/nos_parteners/vizmerald.png', type: 'industrial' }
        ];

        const allPartners = [...internationalPartners, ...academicPartners, ...industrialPartners];

        await Partner.insertMany(allPartners);
        console.log(`Seeded ${allPartners.length} partners successfully.`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding partners:', error);
        process.exit(1);
    }
};

seedPartners();
