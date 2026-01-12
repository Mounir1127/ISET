"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const AttendanceSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    schedule: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Schedule', required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Attendance'] || mongoose_1.default.model('Attendance', AttendanceSchema);
