import mongoose from 'mongoose';
import User from '../models/User';
import Department from '../models/Department';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr';

const teachers = [
    // TI
    { name: 'Dr. Sami Mansour', email: 'sami.mansour@isetkr.tn', matricule: 'TI001', grade: 'Maître de Conférences', speciality: 'Intelligence Artificielle', deptCode: 'TI' },
    { name: 'Mme. Olfa Hamdi', email: 'olfa.hamdi@isetkr.tn', matricule: 'TI002', grade: 'Technologue', speciality: 'Génie Logiciel', deptCode: 'TI' },
    { name: 'M. Ahmed Ben Ali', email: 'ahmed.benali@isetkr.tn', matricule: 'TI003', grade: 'Maître Assistant', speciality: 'Cyber Sécurité', deptCode: 'TI' },
    { name: 'Mme. Meriem Saidi', email: 'meriem.saidi@isetkr.tn', matricule: 'TI004', grade: 'Maître Assistant', speciality: 'Cloud Computing', deptCode: 'TI' },
    { name: 'M. Walid Jlassi', email: 'walid.jlassi@isetkr.tn', matricule: 'TI005', grade: 'Professeur Agrégé', speciality: 'Systèmes Embarqués', deptCode: 'TI' },
    { name: 'Mme. Ines Belhadj', email: 'ines.belhadj@isetkr.tn', matricule: 'TI006', grade: 'Maître Assistant', speciality: 'Data Science', deptCode: 'TI' },

    // GE
    { name: 'M. Ridha Mahmoudi', email: 'ridha.mahmoudi@isetkr.tn', matricule: 'GE001', grade: 'Professeur', speciality: 'Automatisme', deptCode: 'GE' },
    { name: 'Mme. Saloua Trabelsi', email: 'saloua.trabelsi@isetkr.tn', matricule: 'GE002', grade: 'Technologue', speciality: 'Systèmes Électriques', deptCode: 'GE' },
    { name: 'M. Hedi Guesmi', email: 'hedi.guesmi@isetkr.tn', matricule: 'GE003', grade: 'Maître Assistant', speciality: 'Energies Renouvelables', deptCode: 'GE' },
    { name: 'Mme. Fatma Rezgui', email: 'fatma.rezgui@isetkr.tn', matricule: 'GE004', grade: 'Maître Assistant', speciality: 'Electronique de Puissance', deptCode: 'GE' },
    { name: 'M. Kais Chahed', email: 'kais.chahed@isetkr.tn', matricule: 'GE005', grade: 'Professeur Agrégé', speciality: 'Robotique Industrielle', deptCode: 'GE' },

    // GM
    { name: 'M. Moncef Gharbi', email: 'moncef.gharbi@isetkr.tn', matricule: 'GM001', grade: 'Professeur', speciality: 'Conception Mécanique', deptCode: 'GM' },
    { name: 'Mme. Nadia Amara', email: 'nadia.amara@isetkr.tn', matricule: 'GM002', grade: 'Technologue', speciality: 'Fabrication CAO/DAO', deptCode: 'GM' },
    { name: 'M. Slimane Ayadi', email: 'slimane.ayadi@isetkr.tn', matricule: 'GM003', grade: 'Maître Assistant', speciality: 'Maintenance Industrielle', deptCode: 'GM' },
    { name: 'Mme. Leila Khemiri', email: 'leila.khemiri@isetkr.tn', matricule: 'GM004', grade: 'Maître Assistant', speciality: 'Matériaux', deptCode: 'GM' },
    { name: 'M. Foued Abidi', email: 'foued.abidi@isetkr.tn', matricule: 'GM005', grade: 'Professeur Agrégé', speciality: 'Thermodynamique', deptCode: 'GM' },

    // AA (Administration des Affaires / Gestion)
    { name: 'Mme. Sonia Mbarek', email: 'sonia.mbarek@isetkr.tn', matricule: 'GS001', grade: 'Professeur', speciality: 'Comptabilité', deptCode: 'AA' },
    { name: 'M. Mourad Ghorbel', email: 'mourad.ghorbel@isetkr.tn', matricule: 'GS002', grade: 'Technologue', speciality: 'Marketing Digital', deptCode: 'AA' },
    { name: 'Mme. Rim Ben Amor', email: 'rim.benamor@isetkr.tn', matricule: 'GS003', grade: 'Maître Assistant', speciality: 'Finance', deptCode: 'AA' },
    { name: 'M. Anis Sassi', email: 'anis.sassi@isetkr.tn', matricule: 'GS004', grade: 'Maître Assistant', speciality: 'Management RH', deptCode: 'AA' },
    { name: 'Mme. Dorsaf Dridi', email: 'dorsaf.dridi@isetkr.tn', matricule: 'GS005', grade: 'Professeur Agrégé', speciality: 'Economie Industrielle', deptCode: 'AA' },
];

async function seed() {
    try {
        await mongoose.connect(mongodbUri);
        console.log('Connected to MongoDB');

        // Delete existing staff to avoid duplicates during testing
        await User.deleteMany({ role: 'staff', matricule: { $regex: /^(TI|GE|GM|GS)/ } });
        console.log('Cleaned up existing mock staff');

        const departments = await Department.find();

        for (const t of teachers) {
            const dept = departments.find(d => (d.code || '').toUpperCase() === t.deptCode);
            if (dept) {
                await User.create({
                    name: t.name,
                    email: t.email,
                    matricule: t.matricule,
                    role: 'staff',
                    status: 'active',
                    department: dept._id,
                    grade: t.grade,
                    speciality: t.speciality,
                    password: 'password123', // Default password
                    profileImage: `https://i.pravatar.cc/150?u=${t.matricule}` // Random avatar
                });
                console.log(`Created teacher: ${t.name}`);
            } else {
                console.warn(`Department not found for code: ${t.deptCode}`);
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding teachers:', error);
        process.exit(1);
    }
}

seed();
