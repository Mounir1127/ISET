"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ClaimSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    staff: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Module' },
    status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
    title: { type: String },
    description: { type: String, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Claim'] || mongoose_1.default.model('Claim', ClaimSchema);
