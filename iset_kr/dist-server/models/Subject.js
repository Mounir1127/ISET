"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const SubjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Subject'] || mongoose_1.default.model('Subject', SubjectSchema);
