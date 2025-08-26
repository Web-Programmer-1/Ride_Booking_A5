"use strict";
// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny, ZodError } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const zodError = result.error;
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: zodError,
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
