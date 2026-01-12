"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ScheduleSchema = new mongoose_1.Schema({
    module: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Module' },
    subject: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Subject' },
    classGroup: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ClassGroup', required: true },
    staff: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String }, // Optional
    room: { type: String }
}, { timestamps: true });
exports.default = mongoose_1.default.models['Schedule'] || mongoose_1.default.model('Schedule', ScheduleSchema);
