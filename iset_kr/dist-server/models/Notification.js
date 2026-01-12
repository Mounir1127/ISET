"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const NotificationSchema = new mongoose_1.Schema({
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Notification'] || mongoose_1.default.model('Notification', NotificationSchema);
