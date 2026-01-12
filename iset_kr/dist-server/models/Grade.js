"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const GradeSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Module', required: true },
    examType: { type: String, enum: ['DS', 'Examen', 'TP', 'Projet'], required: true },
    value: { type: Number, required: true, min: 0, max: 20 },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    published: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'submitted', 'validated'], default: 'draft' },
    validatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Grade'] || mongoose_1.default.model('Grade', GradeSchema);
