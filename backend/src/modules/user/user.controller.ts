import asyncHandler from "../../utils/asyncHandler";
import { addAdminSchema, addStaffMemberSchema, deleteStaffMemberSchema, updateStaffMemberSchema } from "./user.validation";
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


export const addStaffMember = asyncHandler(async (req, res) => {
    const staffMemberInputData = addStaffMemberSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const staffMemberData = await userService.addStaffMember(staffMemberInputData, clinicId);

    return res.status(201).json({
        success: true,
        message: "Staff Member Data Added Successfully",
        staffMemberData
    })
})

export const getAllStaffMembers = asyncHandler(async (req, res) => {
    const clinicId = req.customUser?.clinicId!;
    const staffData = await userService.getAllStaffMembers(clinicId)
    return res.status(200).json({
        success: true,
        staffData
    })
})

export const updateStaffMember = asyncHandler(async (req, res) => {
    const staffMemberInputData = updateStaffMemberSchema.parse(req.body);
    const clinicId = req.customUser?.clinicId!;
    const staffMemberData = await userService.updateStaffMember(staffMemberInputData, clinicId);

    return res.status(201).json({
        success: true,
        message: "Staff Member Data Added Successfully",
        staffMemberData
    })
})

export const deleteStaffMember = asyncHandler(async (req, res) => {
    const staffMemberInputData = deleteStaffMemberSchema.parse(req.params);
    const clinicId = req.customUser?.clinicId!;
    await userService.deleteStaffMember(staffMemberInputData, clinicId)

    return res.status(200).json({
        success: true,
        message: "Staff Member data deleted successfully"
    })
})