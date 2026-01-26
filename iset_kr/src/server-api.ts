import express from 'express';
// @ts-ignore
import cors from 'cors';
import multer from 'multer';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from './models/User';
import Department from './models/Department';
import ClassGroup from './models/ClassGroup';
import Module from './models/Module';
import Grade from './models/Grade';
import Announcement from './models/Announcement';
import Material from './models/Material';
import Claim from './models/Claim';
import Attendance from './models/Attendance';
import Schedule from './models/Schedule';
import Subject from './models/Subject';
import Notification from './models/Notification';
import Message from './models/Message';
import Contact from './models/Contact';
import GalleryImage from './models/GalleryImage';
import Partner from './models/Partner'; // Imported Partner model
import CatchupSession from './models/CatchupSession';

// ...

// Partner model imported above

import { readdirSync } from 'fs';
import bcrypt from 'bcryptjs';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('--- API Server Debug ---');
console.log('CWD:', process.cwd());

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (Health Check)
app.get('/', (req, res) => { // @ts-ignore
    res.status(200).json({ status: 'online', message: 'Backend server is running correctly' });
});

// Request logging for debugging production
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `material-${uniqueSuffix}.${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

mongoose.set('debug', true);

// MongoDB Connection
const mongodbUri = process.env['MONGODB_URI'] || process.env['MONGO_URI'];
if (!mongodbUri) {
    console.error('❌ CRITICAL: MONGODB_URI or MONGO_URI is not defined in environment variables!');
} else {
    console.log('Connecting to MongoDB Atlas...');
    mongoose.connect(mongodbUri)
        .then(() => console.log('✅ Connected to MongoDB Atlas Successfully'))
        .catch((err) => {
            console.error('❌ Database connection failed!');
            console.error('Error Details:', err.message);
            if (err.message.includes('User not authorized')) {
                console.error('TIP: Check if your database user and password are correct in the URI.');
            } else if (err.message.includes('MongoNetworkError')) {
                console.error('TIP: Check if you have whitelisted "Allow access from anywhere" (0.0.0.0/0) in MongoDB Atlas.');
            }
        });
}

// Auth & Public API Endpoints
// Register
app.post('/api/register', async (req: any, res: any) => {
    try {
        const { email, matricule } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { matricule }] });
        if (existingUser) {
            return res.status(400).json({ message: 'L\'utilisateur avec cet email ou matricule existe déjà.' });
        }

        const cleanData: any = {};
        Object.keys(req.body).forEach(key => {
            const value = req.body[key];
            cleanData[key] = (value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value;
        });

        const hashedPassword = cleanData.password ? bcrypt.hashSync(cleanData.password, 10) : undefined;
        const newUser = new User({
            ...cleanData,
            name: cleanData.fullName || cleanData.name, // Map fullName from frontend to name in model
            password: hashedPassword,
            status: 'pending'
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'Inscription réussie',
            user: { name: savedUser.name, role: savedUser.role, _id: savedUser._id }
        });
    } catch (err: any) {
        console.error('Registration error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val: any) => val.message);
            return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Erreur lors de l\'inscription: ' + err.message });
    }
});

// Login
app.post('/api/login', async (req: any, res: any) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Identifiants requis' });

        const user = await User.findOne({ $or: [{ email: username }, { matricule: username }] });
        if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

        let isMatch = false;
        if (user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isMatch = bcrypt.compareSync(password, user.password);
            } else {
                isMatch = user.password === password;
            }
        }
        if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });

        if (user.status === 'pending') return res.status(403).json({ message: 'Compte en attente' });
        if (user.status === 'inactive') return res.status(403).json({ message: 'Compte désactivé' });

        res.status(200).json({
            message: 'Connexion réussie',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                matricule: user.matricule,
                role: user.role,
                status: user.status
            }
        });
    } catch (err: any) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Erreur interne au serveur lors de la connexion' });
    }
});

// Update User Profile
app.put('/api/user/profile/:id', async (req: any, res: any) => {
    try {
        const { email, matricule, name } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        user.email = email || user.email;
        user.matricule = matricule || user.matricule;
        user.name = name || user.name;

        await user.save();

        res.status(200).json({
            message: 'Profil mis à jour',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                matricule: user.matricule,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
});

// Change Password
app.put('/api/user/password/:id', async (req: any, res: any) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Check current password
        let isMatch = false;
        if (user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isMatch = bcrypt.compareSync(currentPassword, user.password);
            } else {
                isMatch = user.password === currentPassword;
            }
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
    }
});

// Structural Data Public APIs
app.get('/api/public/departments', async (req: any, res: any) => {
    try {
        const departments = await Department.find().sort({ name: 1 }).populate('headOfDepartment').lean();
        res.status(200).json(departments);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ message: 'Error fetching departments' });
    }
});

app.get('/api/public/classes', async (req: any, res: any) => {
    try {
        const classes = await ClassGroup.find().populate('department').lean();
        res.status(200).json(classes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});

app.get('/api/public/modules', async (req: any, res: any) => {
    try {
        const modules = await Module.find().populate('department').lean();
        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching modules' });
    }
});

// Teachers Public API
app.get('/api/public/teachers/department/:deptId', async (req: any, res: any) => {
    const deptId = (req.params.deptId || '').trim();
    console.log(`[TEACHERS] Request for deptId: "${deptId}"`);
    try {
        let department;
        if (mongoose.Types.ObjectId.isValid(deptId)) {
            department = await Department.findById(deptId);
        }
        if (!department) {
            department = await Department.findOne({ code: { $regex: new RegExp(`^${deptId}$`, 'i') } });
        }
        if (!department) {
            const slugMap: { [key: string]: string } = {
                // Informatique
                'technologie-informatique': 'TI',
                'informatique': 'TI',
                'ti': 'TI',

                // Génie Électrique
                'genie-electrique': 'GE',
                'electrique': 'GE',
                'ge': 'GE',

                // Génie Mécanique
                'genie-mecanique': 'GM',
                'mecanique': 'GM',
                'gm': 'GM',

                // Gestion / Administration
                'administration-des-affaires': 'AA',
                'gestion': 'AA',
                'sciences-economiques-et-gestion': 'SEG',
                'economie-et-gestion': 'GESTION',
                'seg': 'SEG',

                // Génie des Procédés
                'génie-des-procédés': 'GP',
                'genie-des-procedes': 'GP',
                'gp': 'GP'
            };
            const code = slugMap[deptId.toLowerCase()];
            if (code) {
                department = await Department.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });
            }
        }
        if (!department) {
            const searchName = deptId.replace(/-/g, ' ');
            department = await Department.findOne({
                $or: [
                    { name: { $regex: new RegExp(searchName, 'i') } },
                    { name: { $regex: new RegExp(deptId.split('-')[0], 'i') } }
                ]
            });
        }

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const teachers = await User.find({
            department: department._id,
            role: 'staff',
            status: 'active'
        }).select('-password').sort({ name: 1 }).lean();

        res.status(200).json(teachers);
    } catch (err) {
        console.error('[TEACHERS] Error fetching teachers:', err);
        res.status(500).json({ message: 'Error fetching teachers' });
    }
});

app.get('/api/public/teachers/:id', async (req: any, res: any) => {
    try {
        const teacher: any = await User.findById(req.params.id)
            .select('-password')
            .populate('department')
            .lean();

        if (!teacher || teacher.role !== 'staff') {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.status(200).json(teacher);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching teacher details' });
    }
});

// Partners API
app.get('/api/partners', async (req: any, res: any) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.status(200).json(partners);
    } catch (err) {
        console.error('Error fetching partners:', err);
        res.status(500).json({ message: 'Error fetching partners' });
    }
});

// --- Admin API Endpoints ---

// User Management
app.post('/api/admin/users', async (req: any, res: any) => {
    try {
        const { email, matricule } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { matricule }] });
        if (existingUser) return res.status(400).json({ message: 'Utilisateur existant.' });

        const newUser = new User({
            ...req.body,
            password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined,
            status: req.body.status || 'active'
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur création utilisateur: ' + err.message });
    }
});

app.get('/api/admin/users', async (req: any, res: any) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.put('/api/admin/users/:id', async (req: any, res: any) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) updateData.password = bcrypt.hashSync(updateData.password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

    } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
}
});

app.post('/api/admin/users/:id/profile-image', upload.single('image'), async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const imageUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profileImage: imageUrl },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Image uploaded successfully', user });
    } catch (err: any) {
        res.status(500).json({ message: 'Error uploading image: ' + err.message });
    }
});

// Department Management
app.get('/api/admin/departments', async (req: any, res: any) => {
    try {
        const departments = await Department.find().populate('headOfDepartment');
        res.status(200).json(departments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching departments' });
    }
});

app.post('/api/admin/departments', async (req: any, res: any) => {
    try {
        const dept = new Department(req.body);
        await dept.save();
        res.status(201).json(dept);
    } catch (err) {
        res.status(500).json({ message: 'Error creating department' });
    }
});

app.delete('/api/admin/departments/:id', async (req: any, res: any) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Department deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting department' });
    }
});

app.put('/api/admin/departments/:id', async (req: any, res: any) => {
    try {
        const updatedDept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedDept);
    } catch (err) {
        res.status(500).json({ message: 'Error updating department' });
    }
});

// Class Management
app.get('/api/admin/classes', async (req: any, res: any) => {
    try {
        const classes = await ClassGroup.find().populate('department');
        res.status(200).json(classes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});

app.post('/api/admin/classes', async (req: any, res: any) => {
    try {
        const classGroup = new ClassGroup(req.body);
        await classGroup.save();
        res.status(201).json(classGroup);
    } catch (err) {
        res.status(500).json({ message: 'Error creating class' });
    }
});

app.delete('/api/admin/classes/:id', async (req: any, res: any) => {
    try {
        await ClassGroup.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Class deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting class' });
    }
});

// Subject Management
app.get('/api/admin/subjects', async (req: any, res: any) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});

app.post('/api/admin/subjects', async (req: any, res: any) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(500).json({ message: 'Error creating subject' });
    }
});

app.delete('/api/admin/subjects/:id', async (req: any, res: any) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subject deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting subject' });
    }
});

// Module Management
app.get('/api/admin/modules', async (req: any, res: any) => {
    try {
        const modules = await Module.find().populate('department');
        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching modules' });
    }
});

app.post('/api/admin/modules', async (req: any, res: any) => {
    try {
        const module = new Module(req.body);
        await module.save();
        res.status(201).json(module);
    } catch (err) {
        res.status(500).json({ message: 'Error creating module' });
    }
});

// Grade Management
app.get('/api/admin/grades', async (req: any, res: any) => {
    try {
        const grades = await Grade.find().populate('student').populate('module');
        res.status(200).json(grades);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching grades' });
    }
});

// Dashboard Stats
app.get('/api/admin/stats', async (req: any, res: any) => {
    try {
        const stats = {
            students: await User.countDocuments({ role: 'student' }),
            teachers: await User.countDocuments({ role: 'staff' }),
            departments: await Department.countDocuments(),
            modules: await Module.countDocuments(),
            userDistribution: {
                students: await User.countDocuments({ role: 'student' }),
                staff: await User.countDocuments({ role: 'staff' }),
                admins: await User.countDocuments({ role: 'admin' }),
                chefs: await User.countDocuments({ role: 'chef' })
            }
        };
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Announcement Management (Admin)
app.get('/api/admin/announcements', async (req: any, res: any) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

app.post('/api/admin/announcements', async (req: any, res: any) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ message: 'Error creating announcement' });
    }
});

app.put('/api/admin/announcements/:id', async (req: any, res: any) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(announcement);
    } catch (err) {
        res.status(500).json({ message: 'Error updating announcement' });
    }
});

app.delete('/api/admin/announcements/:id', async (req: any, res: any) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting announcement' });
    }
});

// API Routes
app.get('/api/announcements', async (req: any, res: any) => {
    try {
        const announcements = await Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Admin Contact Messages Management
app.get('/api/admin/contacts', async (req: any, res: any) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contact messages' });
    }
});

app.put('/api/admin/contacts/:id/read', async (req: any, res: any) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.status(200).json({ message: 'Message marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating contact status' });
    }
});

app.delete('/api/admin/contacts/:id', async (req: any, res: any) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});

// Schedule Management (Admin)
app.get('/api/admin/schedules', async (req: any, res: any) => {
    try {
        const schedules = await Schedule.find()
            .populate('module')
            .populate('subject')
            .populate('classGroup')
            .populate('staff');
        res.status(200).json(schedules);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching schedules' });
    }
});

app.post('/api/admin/schedules', async (req: any, res: any) => {
    console.log('>>> [API] Create Schedule Request:', req.body);
    try {
        // Sanitize: Remove empty string fields that should be ObjectIds
        ['module', 'subject', 'classGroup', 'staff'].forEach(field => {
            if (req.body[field] === '') {
                delete req.body[field];
            }
        });

        const { day, startTime, classGroup, room } = req.body;

        // Validate class conflict
        const classConflict = await Schedule.findOne({
            day,
            startTime,
            classGroup
        });

        if (classConflict) {
            return res.status(409).json({
                error: 'Conflit détecté',
                message: 'Cette classe a déjà une séance à ce créneau horaire.',
                conflictType: 'class'
            });
        }

        // Validate room conflict
        if (room) {
            const roomStr = room.toString();
            const roomConflict = await Schedule.findOne({
                day,
                startTime,
                room: { $regex: new RegExp(`^${roomStr}$`, 'i') }
            });


            if (roomConflict) {
                return res.status(409).json({
                    error: 'Conflit détecté',
                    message: `La salle ${room} est déjà occupée à ce créneau horaire.`,
                    conflictType: 'room'
                });
            }
        }

        const schedule = new Schedule(req.body);
        const savedSchedule = await schedule.save();
        res.status(201).json(savedSchedule);
    } catch (err: any) {
        console.error('>>> [CRITICAL] Schedule creation error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val: any) => val.message);
            return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Error creating schedule', error: err.message });
    }
});

app.delete('/api/admin/schedules/:id', async (req: any, res: any) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Schedule deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting schedule' });
    }
});

// --- Staff API Endpoints ---

app.get('/api/staff/modules', async (req: any, res: any) => {
    try {
        const modules = await Module.find().populate('department');
        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching staff modules' });
    }
});

app.get('/api/staff/students', async (req: any, res: any) => {
    try {
        const { classGroupId } = req.query;
        const filter: any = { role: 'student' };
        if (classGroupId) filter.classGroup = classGroupId;

        const students = await User.find(filter).populate('classGroup');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching staff students' });
    }
});

app.get('/api/staff/grades', async (req: any, res: any) => {
    try {
        const { moduleId, classGroupId } = req.query;
        const grades = await Grade.find({ module: moduleId }).populate('student');
        res.status(200).json(grades);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching staff grades' });
    }
});

app.post('/api/staff/grades/bulk', async (req: any, res: any) => {
    try {
        const { grades } = req.body;
        for (const g of grades) {
            await Grade.findOneAndUpdate(
                { student: g.student, module: g.module, examType: g.examType },
                g,
                { upsert: true, new: true }
            );
        }
        res.status(200).json({ message: 'Grades updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating grades bulk' });
    }
});

app.get('/api/staff/materials', async (req: any, res: any) => {
    try {
        const materials = await Material.find().populate('module');
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching materials' });
    }
});

app.post('/api/staff/materials/upload', upload.single('file'), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileSizeKB = (req.file.size / 1024).toFixed(2);
        const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = req.file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

        const materialData = {
            ...req.body,
            fileUrl: fileUrl,
            size: sizeDisplay
        };
        const material = new Material(materialData);
        await material.save();
        res.status(201).json(material);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur lors de l\'upload: ' + err.message });
    }
});

app.get('/api/staff/claims', async (req: any, res: any) => {
    try {
        const claims = await Claim.find().populate('student').populate('module');
        res.status(200).json(claims);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching claims' });
    }
});

app.put('/api/staff/claims/:id', async (req: any, res: any) => {
    try {
        const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(claim);
    } catch (err) {
        res.status(500).json({ message: 'Error updating claim' });
    }
});

app.get('/api/staff/schedule', async (req: any, res: any) => {
    try {
        const schedule = await Schedule.find({ staff: req.query.staffId })
            .populate('module')
            .populate('classGroup');
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching schedule' });
    }
});

app.get('/api/staff/stats', async (req: any, res: any) => {
    try {
        const staffId = req.query.staffId;
        if (!staffId) return res.status(400).json({ message: 'Staff ID required' });
        const staffUser = await User.findById(staffId);
        if (!staffUser) return res.status(404).json({ message: 'Staff not found' });

        let totalStudents = 0;
        if (staffUser.assignedClasses && staffUser.assignedClasses.length > 0) {
            totalStudents = await User.countDocuments({
                role: 'student',
                classGroup: { $in: staffUser.assignedClasses }
            });
        }
        const totalModules = staffUser.subjects ? staffUser.subjects.length : 0;
        const stats = {
            totalStudents: totalStudents,
            totalModules: totalModules,
            totalMaterials: await Material.countDocuments({ uploadedBy: staffId }),
            pendingClaims: await Claim.countDocuments({ staff: staffId, status: 'pending' })
        };
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching staff stats' });
    }
});

// --- Student API Endpoints ---

app.get('/api/student/stats', async (req: any, res: any) => {
    try {
        const { studentId, classGroupId } = req.query;
        const stats = {
            assignments: await Grade.countDocuments({ student: studentId }),
            absences: await Attendance.countDocuments({ student: studentId, status: 'absent' }),
            materials: await Material.countDocuments({ classGroup: classGroupId }),
            notifications: await Notification.countDocuments({ recipient: studentId, read: false })
        };
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student stats' });
    }
});

app.get('/api/student/schedule', async (req: any, res: any) => {
    try {
        const { classGroupId } = req.query;
        const schedule = await Schedule.find({ classGroup: classGroupId })
            .populate('module')
            .populate('staff');
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student schedule' });
    }
});

app.get('/api/student/grades', async (req: any, res: any) => {
    try {
        const { studentId } = req.query;
        const grades = await Grade.find({ student: studentId }).populate('module');
        res.status(200).json(grades);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student grades' });
    }
});

app.get('/api/student/materials', async (req: any, res: any) => {
    try {
        const { classGroupId } = req.query;
        const materials = await Material.find({ classGroup: classGroupId }).populate('module');
        res.status(200).json(materials);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student materials' });
    }
});

// --- General API Endpoints ---

app.post('/api/public/contact', async (req: any, res: any) => {
    try {
        const contactMessage = new Contact(req.body);
        await contactMessage.save();
        res.status(201).json({ message: 'Message enregistré avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du message' });
    }
});

app.get('/api/notifications', async (req: any, res: any) => {
    try {
        const { userId } = req.query;
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

app.put('/api/notifications/:id/read', async (req: any, res: any) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.status(200).json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});

// --- Gallery API ---
app.get('/api/public/gallery/:category', async (req: any, res: any) => {
    try {
        const { category } = req.params;
        const images = await GalleryImage.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching gallery images' });
    }
});

// ------------------------------------------------------------------
// PARTNERS ENDPOINTS
// ------------------------------------------------------------------

// GET Public Partners
app.get('/api/partners', async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error });
    }
});

// POST Create Partner (Admin)
app.post('/api/partners', upload.single('logo'), async (req, res) => {
    try {
        const { name, link, type } = req.body;
        const logo = req.file ? `assets/uploads/${req.file.filename}` : req.body.logo; // Support URL or Upload

        const newPartner = new Partner({ name, link, type, logo });
        await newPartner.save();
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(500).json({ message: 'Error creating partner', error });
    }
});

// PUT Update Partner (Admin)
app.put('/api/partners/:id', upload.single('logo'), async (req, res) => {
    try {
        const { name, link, type } = req.body;
        let updateData: any = { name, link, type };
        if (req.file) {
            updateData.logo = `assets/uploads/${req.file.filename}`;
        } else if (req.body.logo) {
            updateData.logo = req.body.logo;
        }

        const updatedPartner = await Partner.findByIdAndUpdate(req.params['id'], updateData, { new: true });
        res.json(updatedPartner);
    } catch (error) {
        res.status(500).json({ message: 'Error updating partner', error });
    }
});

// DELETE Partner
app.delete('/api/partners/:id', async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
});

app.post('/api/admin/gallery/upload', upload.single('image'), async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const { category, caption } = req.body;
        const newImage = new GalleryImage({
            url: `/uploads/${req.file.filename}`,
            category: category || 'student_life',
            caption: caption
        });

        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ message: 'Error uploading image' });
    }
});

app.delete('/api/admin/gallery/:id', async (req: any, res: any) => {
    try {
        await GalleryImage.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting image' });
    }
});

// --- Catchup / Rattrapage API ---
app.get('/api/catchup', async (req: any, res: any) => {
    try {
        const { classGroupId, teacherId, departmentId } = req.query;
        const filter: any = {};

        if (classGroupId) filter.classGroup = classGroupId;
        if (teacherId) filter.teacher = teacherId;

        // Filter by Department (Show all sessions for classes in this department)
        if (departmentId) {
            const classesInDept = await ClassGroup.find({ department: departmentId }).select('_id');
            const classIds = classesInDept.map(c => c._id);
            filter.classGroup = { $in: classIds };
        }

        const sessions = await CatchupSession.find(filter)
            .populate('classGroup')
            .populate('subject')
            .populate('teacher')
            .sort({ date: 1, startTime: 1 });

        res.status(200).json(sessions);
    } catch (err) {
        console.error('Error fetching catchup sessions:', err);
        res.status(500).json({ message: 'Error fetching catchup sessions' });
    }
});

app.post('/api/catchup', async (req: any, res: any) => {
    try {
        const session = new CatchupSession(req.body);
        await session.save();
        res.status(201).json(session);
    } catch (err: any) {
        res.status(500).json({ message: 'Error creating catchup session', error: err.message });
    }
});

app.put('/api/catchup/:id', async (req: any, res: any) => {
    try {
        const session = await CatchupSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({ message: 'Error updating catchup session' });
    }
});

app.delete('/api/catchup/:id', async (req: any, res: any) => {
    try {
        await CatchupSession.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Catchup session deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting catchup session' });
    }
});

app.get('/api/admin/seed-gallery', async (req: any, res: any) => {
    try {
        const imagesDir = join(process.cwd(), 'dist/iset_kr/browser/assets/images/vie_etudiants');
        // Fallback for different build structures
        const alternativeDir = join(process.cwd(), 'src/assets/images/vie_etudiants');

        let targetDir = existsSync(imagesDir) ? imagesDir : alternativeDir;
        if (!existsSync(targetDir)) {
            // Try looking in root assets
            targetDir = join(process.cwd(), 'assets/images/vie_etudiants');
        }

        if (!existsSync(targetDir)) {
            return res.status(404).json({ message: 'Images directory not found', checkedPaths: [imagesDir, alternativeDir, targetDir] });
        }

        const files = readdirSync(targetDir);
        let addedCount = 0;

        for (const file of files) {
            if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) continue;

            // Note: URL path depends on how static files are served. 
            // In Angular prod build, they are usually at root or /assets
            const publicUrl = `assets/images/vie_etudiants/${file}`;

            const existing = await GalleryImage.findOne({ url: publicUrl });
            if (!existing) {
                await new GalleryImage({
                    url: publicUrl,
                    category: 'student_life',
                    caption: 'Vie Universitaire ISET Kairouan'
                }).save();
                addedCount++;
            }
        }
        res.status(200).json({ message: `Seeding complete. Added ${addedCount} images.` });
    } catch (err: any) {
        res.status(500).json({ message: 'Seeding failed', error: err.message });
    }
});


// Port
const port = process.env['PORT'] || 4000;

// Serve Angular Static Files (Production)
const angularDistPath = join(process.cwd(), 'dist/iset_kr/browser');
// Check if browser folder exists (Angular 17+ structure), otherwise try root dist
const finalDistPath = existsSync(angularDistPath) ? angularDistPath : join(process.cwd(), 'dist/iset_kr');

if (existsSync(finalDistPath)) {
    console.log(`Serving static files from: ${finalDistPath}`);
    app.use(express.static(finalDistPath));

    // API 404 Handler (First)
    app.use('/api/*', (req, res) => {
        res.status(404).json({ message: 'API Endpoint not found', url: req.url });
    });

    // Angular Catch-all
    app.get('*', (req, res) => {
        res.sendFile(join(finalDistPath, 'index.html'));
    });
} else {
    console.warn('⚠️ Angular dist folder not found. Serving API only.');
    // Catch-all 404 for debugging if frontend is missing
    app.use((req, res) => {
        console.warn(`[404] Unmatched Request: ${req.method} ${req.url}`);
        res.status(404).json({
            message: 'Endpoint non trouvé (Backend Production)',
            method: req.method,
            url: req.url
        });
    });
}

app.listen(port, () => {
    console.log(`API Server listening on port ${port}`);
});
