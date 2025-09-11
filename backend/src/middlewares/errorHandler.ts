
import { Request, Response, NextFunction } from "express";
import { AppError } from "utils/AppError";
import { success } from "zod";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: [err.message],
        });
    }

    console.error("Unexpected Error:", err);
    res.status(500).json({
        success: false,
        message: ["Internal Server Error"],
    });
};
