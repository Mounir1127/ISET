import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    matricule: String,
    password: String,
    role: String
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetPasswords() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/isetkr';
        await mongoose.connect(mongoUri);
        console.log('Connected');

        const hashedPassword = bcrypt.hashSync('isetkr2026', 10);

        // Reset all users with role 'admin' or 'chef' that don't match the password
        const users = await User.find({ role: { $in: ['admin', 'chef'] } });

        for (const user of users) {
            const password = (user as any).password;
            const matches = password && (password.startsWith('$2a$') || password.startsWith('$2b$'))
                ? bcrypt.compareSync('isetkr2026', password)
                : (password === 'isetkr2026');

            if (!matches) {
                console.log(`Resetting password for: ${(user as any).name} (${(user as any).role})`);
                (user as any).password = hashedPassword;
                await user.save();
            } else {
                console.log(`Password already correct for: ${(user as any).name}`);
            }
        }

        console.log('Done');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

resetPasswords();
