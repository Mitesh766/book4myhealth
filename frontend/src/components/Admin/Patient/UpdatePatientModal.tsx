import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientResponse } from "../../../types/patient";
import { useNotification } from "../../../hooks/useNotification";
import { Notification } from "../../ui";
import { updatePatient } from "../../../api/patient";

interface UpdatePatientProps {
  formData: Omit<PatientResponse, "customId" | "createdAt" | "clinicId">;
  setFormData: React.Dispatch<
    React.SetStateAction<
      Omit<PatientResponse, "customId" | "createdAt" | "clinicId">
    >
  >;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdatePatientModal = ({
  formData,
  setFormData,
  setIsModalOpen,
}: UpdatePatientProps) => {
  const queryClient = useQueryClient();

  const { notification, showNotification, hideNotification } =
    useNotification();

  const updatePatientMutation = useMutation({
    mutationFn: () => updatePatient(formData),
    onSuccess: (newPatient) => {
      queryClient.setQueryData(
        ["patients"],
        (oldPatients: PatientResponse[]) => {
          if (!oldPatients) return [];
          return oldPatients.map((patient) =>
            patient.id === newPatient.id ? newPatient : patient
          );
        }
      );
      showNotification("success", ["Patient Data updated successfully"]);
      setTimeout(()=>{
          setIsModalOpen(false);
        },1000)
    },
    onError: (err: any) => {
      showNotification("error", err.response.data.message);
    },
  });

  return (
    <div className="space-y-6">
      <Notification
        type={notification.type}
        messages={notification.messages}
        onClose={hideNotification}
        isVisible={notification.isVisible}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Patient Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNo: e.target.value }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: e.target.value as "Male" | "Female" | "Other",
              }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Address
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter Address"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-2 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={() => updatePatientMutation.mutate()}
          disabled={updatePatientMutation.isPending}
          className={`px-6 cursor-pointer py-2 rounded-lg text-white flex items-center justify-center gap-2 transition-colors
    ${
      updatePatientMutation.isPending
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
        >
          {updatePatientMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Updating...
            </>
          ) : (
            "Updating Patient"
          )}
        </button>
      </div>
    </div>
  );
};
