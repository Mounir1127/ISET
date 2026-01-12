import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../src/models/Subject';
import Department from '../src/models/Department';

// Load env vars
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
}

console.log('Script started.');
console.log('MONGO_URI defined:', !!process.env.MONGO_URI);

const subjectsData = [
    {
        departmentName: 'Section Gestion', // Matching the possible DB name
        aliases: ['Administration des Affaires / Gestion', 'Gestion'],
        code: 'GESTION',
        subjects: [
            'Introduction à l’économie',
            'Microéconomie',
            'Macroéconomie',
            'Comptabilité générale',
            'Comptabilité financière',
            'Management des entreprises',
            'Marketing',
            'Gestion de production',
            'Droit commercial',
            'Management des ressources humaines',
            'Gestion financière',
            'Statistiques appliquées',
            'Informatique appliquée à la gestion',
            'Techniques de communication professionnelle',
            'Anglais technique',
            'Projet tutoré / Projet de fin d’études'
        ]
    },
    {
        departmentName: 'Informatique',
        aliases: ['Technologies de l’Informatique'],
        code: 'TI',
        subjects: [
            'Mathématiques pour l’informatique',
            'Algorithmique et programmation structurée',
            'Programmation orientée objet',
            'Structures de données',
            'Bases de données',
            'Systèmes d’exploitation',
            'Réseaux informatiques',
            'Développement Web (HTML, CSS, JavaScript)',
            'Développement mobile (Android/iOS)',
            'Génie logiciel',
            'Sécurité informatique',
            'Systèmes embarqués',
            'Anglais technique en informatique',
            'Communication professionnelle',
            'Projet tutoré / Projet de fin d’études'
        ]
    },
    {
        departmentName: 'Génie Électrique',
        aliases: ['Génie électrique'],
        code: 'GE',
        subjects: [
            'Électrotechnique générale',
            'Circuits électriques',
            'Machines électriques',
            'Electronique analogique',
            'Electronique numérique',
            'Automatique',
            'Énergie et distribution électrique',
            'Mesure & métrologie',
            'Installation électrique',
            'Atelier pratique de machines électriques',
            'Sécurité électrique',
            'Anglais technique',
            'Communication professionnelle',
            'Projet tutoré / Projet de fin d’études'
        ]
    },
    {
        departmentName: 'Génie Mécanique',
        aliases: ['Génie mécanique'],
        code: 'GM',
        subjects: [
            'Mathématiques appliquées au génie mécanique',
            'Mécanique générale',
            'Résistance des matériaux',
            'Thermodynamique appliquée',
            'Technologie des matériaux',
            'Atelier de fabrication mécanique',
            'DAO / CAO (Dessin assisté par ordinateur)',
            'Maintenance industrielle',
            'Technique de réparation des systèmes mécaniques',
            'Commande industrielle des machines',
            'Hydraulique & pneumatique',
            'Systèmes thermiques',
            'Options techniques de spécialisation',
            'Anglais technique',
            'Communication professionnelle',
            'Projet tutoré / Projet de fin d’études'
        ]
    },
    {
        departmentName: 'Transversal',
        aliases: ['Matières transversales'],
        code: 'TRANS',
        subjects: [
            'Mathématiques générales',
            'Physique',
            'Informatique de base',
            'Anglais',
            'Français / Communication',
            'Projet tutoré (PFE)',
            'Méthodes de travail universitaire',
            'Culture générale et professionnelle'
        ]
    }
];

const seedSubjects = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            console.error('CRITICAL: MONGO_URI or MONGODB_URI is missing.');
            return;
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        for (const data of subjectsData) {
            console.log(`Processing department: ${data.departmentName}`);

            // Find or create department
            let department = await Department.findOne({
                $or: [
                    { name: data.departmentName },
                    { code: data.code },
                    { name: { $in: data.aliases } }
                ]
            });

            if (!department) {
                console.log(`Department '${data.departmentName}' not found. Creating it...`);
                department = await Department.create({
                    name: data.departmentName,
                    code: data.code,
                    description: `Department of ${data.departmentName}`
                });
                console.log(`Created department: ${department.name} (${department._id})`);
            } else {
                console.log(`Found department: ${department.name} (${department._id})`);
            }

            for (const subjectName of data.subjects) {
                const existingSubject = await Subject.findOne({ name: subjectName, department: department._id });
                if (existingSubject) {
                    // console.log(`Subject exists: ${subjectName}`);
                    continue;
                }

                await Subject.create({
                    name: subjectName,
                    department: department._id
                });
                console.log(`Added subject: ${subjectName}`);
            }
        }

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedSubjects();
