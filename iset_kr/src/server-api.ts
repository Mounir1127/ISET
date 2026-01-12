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
import bcrypt from 'bcryptjs';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('--- API Server Debug ---');
console.log('CWD:', process.cwd());

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
const mongodbUri = process.env['MONGODB_URI'];
if (!mongodbUri) {
    console.error('❌ CRITICAL: MONGODB_URI is not defined in environment variables!');
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

app.delete('/api/admin/users/:id', async (req: any, res: any) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
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

// Port
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
    console.log(`API Server listening on http://localhost:${port}`);
});
