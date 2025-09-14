export interface PatientResponse {
  id: string;
  clinicId: string;
  customId: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  phoneNo: string;
  address: string;
  createdAt: string;
}