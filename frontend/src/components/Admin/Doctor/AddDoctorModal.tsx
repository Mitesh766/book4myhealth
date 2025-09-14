import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoctor } from "../../../api/doctor";
import type { Doctor } from "../../../types/doctor";
import { useNotification } from "../../../hooks/useNotification";
import { Notification } from "../../ui";

interface AddDoctorModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddDoctorModal = ({ setIsModalOpen }: AddDoctorModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    gender: "",
    specialisation: "",
    avgTimePerPatient: 20,
  });

  const queryClient = useQueryClient();

  const { notification, showNotification, hideNotification } =
    useNotification();

  const addDoctorDataMutation = useMutation({
    mutationFn: () => addDoctor(formData),
    onSuccess: (newDoctor) => {
      queryClient.setQueryData(["doctors"], (oldDoctors: Doctor[]) => [
        ...oldDoctors,
        newDoctor,
      ]);
      showNotification("success", ["Doctor Data added successfully"]);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
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
            Doctor Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter doctor name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email"
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
              setFormData((prev) => ({ ...prev, gender: e.target.value }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Specialisation
          </label>
          <input
            type="text"
            value={formData.specialisation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specialisation: e.target.value,
              }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Cardiology, ENT"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Avg Time Per Patient (mins)
          </label>
          <input
            type="number"
            value={formData.avgTimePerPatient}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                avgTimePerPatient: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="120"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-6 py-2 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={() => addDoctorDataMutation.mutate()}
          disabled={addDoctorDataMutation.isPending}
          className={`px-6 cursor-pointer py-2 rounded-lg text-white flex items-center justify-center gap-2 transition-colors
    ${
      addDoctorDataMutation.isPending
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
        >
          {addDoctorDataMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </>
          ) : (
            "Add Doctor"
          )}
        </button>
      </div>
    </div>
  );
};
