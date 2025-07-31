"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: err.errors,
            });
        }
    };
};
exports.validateRequest = validateRequest;
