import asyncHandler from "../../utils/asyncHandler";
import { addAdminSchema } from "./user.validation";
import * as userService from "./user.service"
import { success } from "zod";
export const addAdmin = asyncHandler(async (req, res) => {
    const adminInputData = addAdminSchema.parse(req.body);
    const adminData = await userService.addAdmin(adminInputData);

    return res.status(201).json({
        success: true,
        message: "Admin data added successfully",
        adminData
    })
})  