import asyncHandler from "../../utils/asyncHandler";
import * as authService from "./auth.servcie"
import { loginSchema } from "./auth.validation";
import { success } from "zod";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const { accessToken, refreshToken ,role} = await authService.login(email, password);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 15, //15min
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({
        success: true,
        message: "Login successfull",
        role
    })

})

export const checkAuth = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User verified successfully"
    })
})


export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict"
    })
})