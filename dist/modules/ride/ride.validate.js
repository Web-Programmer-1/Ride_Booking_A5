"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideRequestSchema = void 0;
const zod_1 = require("zod");
exports.rideRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        pickupLocation: zod_1.z.string().min(1, 'Pickup location is required'),
        destination: zod_1.z.string().min(1, 'Destination is required'),
    }),
});
