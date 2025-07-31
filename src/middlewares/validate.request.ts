// import { NextFunction, Request, Response } from 'express';
// import { ZodTypeAny, ZodError } from 'zod';



// export const validateRequest = (schema: ZodTypeAny) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req.body);

//     if (!result.success) {
//       const error = result.error as ZodError; 

//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: error.errors , 
//       });
//     }

//     next();
//   };
// };



import { ZodError, ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // ✅ Fix: use Type Assertion
      const zodError = result.error as ZodError;

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: zodError, // ✅ Fully type-safe now
      });
    }

    next();
  };
};
