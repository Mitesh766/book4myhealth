import { AppError } from "../../utils/AppError";
import bcrypt from "bcryptjs"
import { generateTokens } from "./auth.utils";
import {prisma} from "../../config/db"

export const login = async (email: string, password: string) => {
    const user = await prisma?.user.findUnique({
        where: { email }
    });

    if (!user) throw new AppError("User does not exist", 403);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError("Invalid credentials", 400)

    const tokens = await generateTokens(user.id, user.role, user.clinicId)
    return tokens
}