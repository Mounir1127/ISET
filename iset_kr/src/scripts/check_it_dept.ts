import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function run() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        await mongoose.connect(mongoUri!);

        // Find department
        const dept = await mongoose.connection.collection('departments').findOne({
            $or: [
                { code: 'TI' },
                { name: /Informatique/i },
                { _id: new mongoose.Types.ObjectId('6965860310925fc133c9daec') } // From previous report
            ]
        });

        if (dept) {
            console.log('Department found:', JSON.stringify(dept, null, 2));

            // Find HOD
            if (dept.headOfDepartment) {
                const hod = await mongoose.connection.collection('users').findOne({ _id: dept.headOfDepartment });
                console.log('HOD found:', JSON.stringify(hod, null, 2));
            }
        } else {
            console.log('Department NOT found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
