import mongoose from 'mongoose';
import User from './src/models/User';
import Department from './src/models/Department';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuration
const LOCAL_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iset_kr';
const PROD_URI = process.env.PROD_MONGODB_URI || '';

async function migrate() {
    if (!PROD_URI) {
        console.error('❌ ERREUR: Variable PROD_MONGODB_URI non définie');
        console.log('💡 Ajoutez PROD_MONGODB_URI dans votre fichier .env');
        console.log('   Exemple: PROD_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/iset_kr');
        process.exit(1);
    }

    try {
        console.log('🔄 Connexion à la base de données locale...');
        await mongoose.connect(LOCAL_URI);

        // Récupérer les données locales
        const departments = await Department.find({});
        const teachers = await User.find({ role: 'staff' });
        const students = await User.find({ role: 'student' });
        const admins = await User.find({ role: 'admin' });

        console.log(`📊 Données locales trouvées:`);
        console.log(`   - ${departments.length} départements`);
        console.log(`   - ${teachers.length} enseignants`);
        console.log(`   - ${students.length} étudiants`);
        console.log(`   - ${admins.length} administrateurs`);

        if (departments.length === 0 && teachers.length === 0) {
            console.log('⚠️  Aucune donnée à migrer');
            await mongoose.disconnect();
            return;
        }

        await mongoose.disconnect();
        console.log('✅ Déconnecté de la base locale\n');

        // Connexion à la production
        console.log('🔄 Connexion à la base de données de production...');
        await mongoose.connect(PROD_URI);
        console.log('✅ Connecté à la production\n');

        // Migrer les départements
        if (departments.length > 0) {
            console.log('📦 Migration des départements...');
            for (const dept of departments) {
                const deptData = dept.toObject();
                delete deptData._id;
                delete deptData.__v;

                await Department.findOneAndUpdate(
                    { code: dept.code },
                    deptData,
                    { upsert: true, new: true }
                );
                console.log(`   ✓ ${dept.name} (${dept.code})`);
            }
        }

        // Migrer les enseignants
        if (teachers.length > 0) {
            console.log('\n👨‍🏫 Migration des enseignants...');
            for (const teacher of teachers) {
                const teacherData = teacher.toObject();
                delete teacherData.__v;

                await User.findOneAndUpdate(
                    { email: teacher.email },
                    teacherData,
                    { upsert: true, new: true }
                );
                console.log(`   ✓ ${teacher.name} (${teacher.email})`);
            }
        }

        // Migrer les étudiants (optionnel)
        if (students.length > 0) {
            console.log('\n👨‍🎓 Migration des étudiants...');
            for (const student of students) {
                const studentData = student.toObject();
                delete studentData.__v;

                await User.findOneAndUpdate(
                    { email: student.email },
                    studentData,
                    { upsert: true, new: true }
                );
                console.log(`   ✓ ${student.name}`);
            }
        }

        // Migrer les admins
        if (admins.length > 0) {
            console.log('\n👤 Migration des administrateurs...');
            for (const admin of admins) {
                const adminData = admin.toObject();
                delete adminData.__v;

                await User.findOneAndUpdate(
                    { email: admin.email },
                    adminData,
                    { upsert: true, new: true }
                );
                console.log(`   ✓ ${admin.name}`);
            }
        }

        await mongoose.disconnect();
        console.log('\n✅ Migration terminée avec succès !');
        console.log('🎉 Vos enseignants devraient maintenant s\'afficher en production');

    } catch (error: any) {
        console.error('❌ Erreur lors de la migration:', error.message);
        process.exit(1);
    }
}

// Exécuter la migration
migrate();
