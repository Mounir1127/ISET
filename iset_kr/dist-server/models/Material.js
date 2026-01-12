"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const MaterialSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    fileType: { type: String },
    fileUrl: { type: String, required: true },
    size: { type: String },
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Module', required: true },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Material'] || mongoose_1.default.model('Material', MaterialSchema);
