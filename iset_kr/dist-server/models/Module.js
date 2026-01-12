"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ModuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    coefficient: { type: Number, required: true },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Module'] || mongoose_1.default.model('Module', ModuleSchema);
