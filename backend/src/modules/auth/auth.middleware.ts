import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "./auth.utils";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isAccessTokenVerified = verifyAccessToken(req, res, next);
    if (isAccessTokenVerified) return;
    
    const isRefreshTokenVerified = await verifyRefreshToken(req, res, next);
    if (isRefreshTokenVerified) return;

    return res.status(401).json({
        success: false,
        message: "Authentication Required"
    })
}


export const authoriseRole = (role: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const customRole = req?.customUser?.role!
    if (role.includes(customRole)) {
        next()
        return;
    }
    return res.status(403).send("Un-Authorised");
}
