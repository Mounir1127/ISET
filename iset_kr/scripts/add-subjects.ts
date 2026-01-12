import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

// Subject Schema
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true },
    department: { type: String },
    credits: { type: Number, default: 3 },
    semester: { type: Number },
    description: { type: String }
});

const Subject = mongoose.model('Subject', subjectSchema);

const subjects = [
    // 📊 Gestion / Administration des Affaires
    { name: "Introduction à l'économie", code: "GEST-ECO-01", department: "Gestion", credits: 3, semester: 1 },
    { name: "Microéconomie", code: "GEST-ECO-02", department: "Gestion", credits: 3, semester: 2 },
    { name: "Macroéconomie", code: "GEST-ECO-03", department: "Gestion", credits: 3, semester: 3 },
    { name: "Comptabilité générale", code: "GEST-COMPT-01", department: "Gestion", credits: 4, semester: 1 },
    { name: "Comptabilité financière", code: "GEST-COMPT-02", department: "Gestion", credits: 4, semester: 2 },
    { name: "Management des entreprises", code: "GEST-MGT-01", department: "Gestion", credits: 3, semester: 2 },
    { name: "Marketing", code: "GEST-MKT-01", department: "Gestion", credits: 3, semester: 3 },
    { name: "Gestion de production", code: "GEST-PROD-01", department: "Gestion", credits: 3, semester: 4 },
    { name: "Droit commercial", code: "GEST-DROIT-01", department: "Gestion", credits: 2, semester: 3 },
    { name: "Management des ressources humaines", code: "GEST-RH-01", department: "Gestion", credits: 3, semester: 4 },
    { name: "Gestion financière", code: "GEST-FIN-01", department: "Gestion", credits: 4, semester: 4 },
    { name: "Statistiques appliquées", code: "GEST-STAT-01", department: "Gestion", credits: 3, semester: 2 },
    { name: "Informatique appliquée à la gestion", code: "GEST-INFO-01", department: "Gestion", credits: 2, semester: 1 },
    { name: "Techniques de communication professionnelle", code: "GEST-COM-01", department: "Gestion", credits: 2, semester: 1 },
    { name: "Anglais technique", code: "GEST-ANG-01", department: "Gestion", credits: 2, semester: 1 },
    { name: "Projet tutoré", code: "GEST-PROJ-01", department: "Gestion", credits: 6, semester: 5 },
    { name: "Projet de fin d'études", code: "GEST-PFE-01", department: "Gestion", credits: 10, semester: 6 },

    // 💻 Technologies de l'Informatique
    { name: "Mathématiques pour l'informatique", code: "INFO-MATH-01", department: "Informatique", credits: 4, semester: 1 },
    { name: "Algorithmique et programmation structurée", code: "INFO-ALGO-01", department: "Informatique", credits: 4, semester: 1 },
    { name: "Programmation orientée objet", code: "INFO-POO-01", department: "Informatique", credits: 4, semester: 2 },
    { name: "Structures de données", code: "INFO-STRUCT-01", department: "Informatique", credits: 3, semester: 2 },
    { name: "Bases de données", code: "INFO-BD-01", department: "Informatique", credits: 4, semester: 2 },
    { name: "Systèmes d'exploitation", code: "INFO-SE-01", department: "Informatique", credits: 3, semester: 2 },
    { name: "Réseaux informatiques", code: "INFO-RES-01", department: "Informatique", credits: 4, semester: 3 },
    { name: "Développement Web", code: "INFO-WEB-01", department: "Informatique", credits: 4, semester: 3, description: "HTML, CSS, JavaScript" },
    { name: "Développement mobile", code: "INFO-MOBILE-01", department: "Informatique", credits: 4, semester: 4, description: "Android/iOS" },
    { name: "Génie logiciel", code: "INFO-GL-01", department: "Informatique", credits: 3, semester: 3 },
    { name: "Sécurité informatique", code: "INFO-SEC-01", department: "Informatique", credits: 3, semester: 4 },
    { name: "Systèmes embarqués", code: "INFO-EMB-01", department: "Informatique", credits: 3, semester: 5 },
    { name: "Anglais technique en informatique", code: "INFO-ANG-01", department: "Informatique", credits: 2, semester: 1 },
    { name: "Communication professionnelle", code: "INFO-COM-01", department: "Informatique", credits: 2, semester: 1 },
    { name: "Projet tutoré", code: "INFO-PROJ-01", department: "Informatique", credits: 6, semester: 5 },
    { name: "Projet de fin d'études", code: "INFO-PFE-01", department: "Informatique", credits: 10, semester: 6 },

    // ⚡ Génie Électrique
    { name: "Électrotechnique générale", code: "ELEC-TECH-01", department: "Génie Électrique", credits: 4, semester: 1 },
    { name: "Circuits électriques", code: "ELEC-CIRC-01", department: "Génie Électrique", credits: 4, semester: 1 },
    { name: "Machines électriques", code: "ELEC-MACH-01", department: "Génie Électrique", credits: 4, semester: 2 },
    { name: "Electronique analogique", code: "ELEC-ANA-01", department: "Génie Électrique", credits: 4, semester: 2 },
    { name: "Electronique numérique", code: "ELEC-NUM-01", department: "Génie Électrique", credits: 4, semester: 2 },
    { name: "Automatique", code: "ELEC-AUTO-01", department: "Génie Électrique", credits: 4, semester: 3 },
    { name: "Énergie et distribution électrique", code: "ELEC-ENERG-01", department: "Génie Électrique", credits: 3, semester: 3 },
    { name: "Mesure & métrologie", code: "ELEC-MES-01", department: "Génie Électrique", credits: 3, semester: 2 },
    { name: "Installation électrique", code: "ELEC-INST-01", department: "Génie Électrique", credits: 3, semester: 3 },
    { name: "Atelier pratique de machines électriques", code: "ELEC-ATEL-01", department: "Génie Électrique", credits: 2, semester: 3 },
    { name: "Sécurité électrique", code: "ELEC-SEC-01", department: "Génie Électrique", credits: 2, semester: 4 },
    { name: "Anglais technique", code: "ELEC-ANG-01", department: "Génie Électrique", credits: 2, semester: 1 },
    { name: "Communication professionnelle", code: "ELEC-COM-01", department: "Génie Électrique", credits: 2, semester: 1 },
    { name: "Projet tutoré", code: "ELEC-PROJ-01", department: "Génie Électrique", credits: 6, semester: 5 },
    { name: "Projet de fin d'études", code: "ELEC-PFE-01", department: "Génie Électrique", credits: 10, semester: 6 },

    // ⚙️ Génie Mécanique
    { name: "Mathématiques appliquées au génie mécanique", code: "MECA-MATH-01", department: "Génie Mécanique", credits: 4, semester: 1 },
    { name: "Mécanique générale", code: "MECA-GEN-01", department: "Génie Mécanique", credits: 4, semester: 1 },
    { name: "Résistance des matériaux", code: "MECA-RDM-01", department: "Génie Mécanique", credits: 4, semester: 2 },
    { name: "Thermodynamique appliquée", code: "MECA-THERMO-01", department: "Génie Mécanique", credits: 3, semester: 2 },
    { name: "Technologie des matériaux", code: "MECA-MAT-01", department: "Génie Mécanique", credits: 3, semester: 2 },
    { name: "Atelier de fabrication mécanique", code: "MECA-FAB-01", department: "Génie Mécanique", credits: 3, semester: 2 },
    { name: "DAO / CAO", code: "MECA-CAO-01", department: "Génie Mécanique", credits: 3, semester: 3, description: "Dessin assisté par ordinateur" },
    { name: "Maintenance industrielle", code: "MECA-MAINT-01", department: "Génie Mécanique", credits: 3, semester: 3 },
    { name: "Technique de réparation des systèmes mécaniques", code: "MECA-REP-01", department: "Génie Mécanique", credits: 3, semester: 4 },
    { name: "Commande industrielle des machines", code: "MECA-CMD-01", department: "Génie Mécanique", credits: 3, semester: 4 },
    { name: "Hydraulique & pneumatique", code: "MECA-HYDR-01", department: "Génie Mécanique", credits: 3, semester: 3 },
    { name: "Systèmes thermiques", code: "MECA-THERM-01", department: "Génie Mécanique", credits: 3, semester: 4 },
    { name: "Mécatronique", code: "MECA-MECA-01", department: "Génie Mécanique", credits: 3, semester: 5 },
    { name: "Anglais technique", code: "MECA-ANG-01", department: "Génie Mécanique", credits: 2, semester: 1 },
    { name: "Communication professionnelle", code: "MECA-COM-01", department: "Génie Mécanique", credits: 2, semester: 1 },
    { name: "Projet tutoré", code: "MECA-PROJ-01", department: "Génie Mécanique", credits: 6, semester: 5 },
    { name: "Projet de fin d'études", code: "MECA-PFE-01", department: "Génie Mécanique", credits: 10, semester: 6 },

    // 🧩 Matières transversales
    { name: "Mathématiques générales", code: "TRANS-MATH-01", department: "Transversal", credits: 4, semester: 1 },
    { name: "Physique", code: "TRANS-PHYS-01", department: "Transversal", credits: 3, semester: 1 },
    { name: "Informatique de base", code: "TRANS-INFO-01", department: "Transversal", credits: 2, semester: 1 },
    { name: "Anglais", code: "TRANS-ANG-01", department: "Transversal", credits: 2, semester: 1 },
    { name: "Français / Communication", code: "TRANS-FR-01", department: "Transversal", credits: 2, semester: 1 },
    { name: "Méthodes de travail universitaire", code: "TRANS-MTU-01", department: "Transversal", credits: 2, semester: 1 },
    { name: "Culture générale et professionnelle", code: "TRANS-CULT-01", department: "Transversal", credits: 2, semester: 2 }
];

async function addSubjects() {
    try {
        const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr';
        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté à MongoDB\n');

        console.log('🗑️  Suppression des anciennes matières...');
        await Subject.deleteMany({});
        console.log('✅ Anciennes matières supprimées\n');

        console.log('📚 Ajout des nouvelles matières...\n');

        let count = 0;
        for (const subject of subjects) {
            try {
                await Subject.create(subject);
                count++;
                console.log(`  ✓ ${subject.name} (${subject.code})`);
            } catch (err: any) {
                console.error(`  ✗ Erreur pour ${subject.name}:`, err.message);
            }
        }

        console.log(`\n✅ ${count}/${subjects.length} matières ajoutées avec succès!\n`);

        // Statistiques par département
        console.log('📊 Statistiques par département:');
        const stats = await Subject.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        stats.forEach(stat => {
            console.log(`  - ${stat._id}: ${stat.count} matières`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Script terminé avec succès!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

addSubjects();
