import { Edit, Fingerprint, Phone, Trash2, User } from "lucide-react";
import type { PatientResponse } from "../../../types/patient";

interface PatientCardProps {
  patient: PatientResponse;
  onEdit: (patient: PatientResponse) => void;
  onDelete: (id: string) => void;
}

export const PatientCard = ({
  patient,
  onEdit,
  onDelete,
}: PatientCardProps) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow-lg hover:shadow-blue-500/10 hover:border-blue-800 transition-all duration-300 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-100">{patient.name}</h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            patient.gender === "Male"
              ? "bg-blue-900 text-blue-300"
              : "bg-pink-900 text-pink-300"
          }`}
        >
          {patient.gender}
        </span>
      </div>
      <div className="space-y-2 text-gray-400 text-sm">
        <p className="flex items-center">
          <Fingerprint className="w-4 h-4 mr-2 text-gray-500" /> ID:{" "}
          <span className="text-gray-300 ml-1">{patient.customId}</span>
        </p>
        <p className="flex items-center">
          <Phone className="w-4 h-4 mr-2 text-gray-500" /> Phone:{" "}
          <span className="text-gray-300 ml-1">{patient.phoneNo}</span>
        </p>
        <p className="flex items-start">
          <User className="w-4 h-4 mr-2 text-gray-500 mt-1" /> Address:{" "}
          <span className="text-gray-300 ml-1">{patient.address}</span>
        </p>
      </div>
    </div>
    <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-800">
      <button
        onClick={() => onEdit(patient)}
        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 rounded-full transition-colors"
      >
        <Edit className="w-5 h-5" />
      </button>
      <button
        onClick={() => onDelete(patient.id)}
        className="p-2 text-red-500 hover:text-red-400 hover:bg-gray-800 rounded-full transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);
