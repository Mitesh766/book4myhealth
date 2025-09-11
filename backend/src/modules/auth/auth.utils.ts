import "dotenv/config"
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as userService from "../user/user.service"
import { prisma } from "../../config/db"


const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;




export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return false;
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as JwtPayload;
        const { id, role, clinicId } = decoded;
        req.customUser = { id, role, clinicId };
        next();
        return true;
    }
    catch (err) {
        return false;
    }

}

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<boolean> => {
    const refreshToken = req.cookies.refreshToken;
   
    if (!refreshToken) return false;
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as JwtPayload;
        const { id, role, clinicId } = decoded;
        const userData = await userService.findUserByIdAndRole(id, role);
        if (!userData || !userData.refreshToken || userData.refreshToken !== refreshToken) {
            return false;
        }
     
        req.customUser = { id, role, clinicId };
        const accessToken = generateAccessToken(id, role, clinicId);
        const isProduction = process.env.NODE_ENV === "production"

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 15, //15min
        });

        next();
        return true;
    }
    catch (err) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict"
        })
        return false;
    }
}


export const generateTokens = async (
    id: string,
    role: string,
    clinicId: string | null
): Promise<{ accessToken: string, refreshToken: string }> => {
    const accessToken = generateAccessToken(id, role, clinicId)
    const refreshToken = await generateRefreshToken(id, role, clinicId)
    return { accessToken, refreshToken }
};


export const generateAccessToken = (
    id: string,
    role: string,
    clinicId: string | null
): string => {
    const accessToken = jwt.sign(
        { id, role, clinicId },
        ACCESS_SECRET as unknown as string,
        {
            expiresIn: "15m",
        }
    );

    return accessToken
};

export const generateRefreshToken = async (
    id: string,
    role: string,
    clinicId: string | null
): Promise<string> => {

    const refreshToken = jwt.sign(
        { id, role, clinicId },
        REFRESH_SECRET!,
        {
            expiresIn: "7d",
        }
    );


    await prisma.user.update({
        data: {
            refreshToken
        },
        where: {
            id
        }
    })
    return refreshToken

};
