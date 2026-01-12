"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ClassGroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department', required: true },
    level: { type: Number, required: true },
    section: { type: String, required: true },
    group: { type: Number }
}, { timestamps: true });
exports.default = mongoose_1.default.models['ClassGroup'] || mongoose_1.default.model('ClassGroup', ClassGroupSchema);
