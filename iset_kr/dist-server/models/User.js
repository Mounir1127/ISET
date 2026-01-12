"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricule: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'staff', 'admin', 'chef'], default: 'student' },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'pending' },
    phone: { type: String },
    cin: { type: String },
    birthDate: { type: Date },
    gender: { type: String },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' },
    classGroup: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ClassGroup' }, // For students
    level: { type: Number },
    group: { type: Number },
    grade: { type: String },
    speciality: { type: String },
    office: { type: String },
    assignedClasses: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ClassGroup' }],
    subjects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });
exports.default = mongoose_1.default.models['User'] || mongoose_1.default.model('User', UserSchema);
