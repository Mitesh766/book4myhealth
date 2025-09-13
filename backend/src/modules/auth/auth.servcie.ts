import { AppError } from "../../utils/AppError";
import bcrypt from "bcryptjs"
import { generateTokens } from "./auth.utils";
import { prisma } from "../../config/db"
import { LoginDataInput } from "./auth.validation";

export const login = async ({ email, password }: LoginDataInput) => {
    const user = await prisma?.user.findFirst({
        where: { email }
    });

    if (!user) throw new AppError("User does not exist", 404);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new AppError("Invalid credentials", 401)

    const tokens = await generateTokens(user.id, user.role, user.clinicId)
    return { ...tokens, role: user.role }
}