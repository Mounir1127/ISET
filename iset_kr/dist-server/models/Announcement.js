"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const AnnouncementSchema = new mongoose_1.Schema({
    type: { type: String, required: true }, // Removed strict enum to allow flexibility
    title: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'archived', 'cancelled'], default: 'published' },
    publishDate: { type: Date, default: Date.now },
    image: { type: String },
    // Common fields
    number: { type: String },
    arabicText: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'low' },
    attachments: [{
            name: { type: String },
            url: { type: String }
        }],
    // Manifestations
    description: { type: String },
    eventType: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    time: { type: String },
    location: { type: String },
    targetAudience: { type: [String] }, // Changed to array of strings
    organizer: { type: String },
    // Appels d'offre
    reference: { type: String },
    issuer: { type: String },
    deadline: { type: Date },
    conditions: { type: String },
    documents: [{ type: String }],
    contact: { type: String },
    // Nouveautés
    summary: { type: String },
    content: { type: String },
    author: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.models['Announcement'] || mongoose_1.default.model('Announcement', AnnouncementSchema);
