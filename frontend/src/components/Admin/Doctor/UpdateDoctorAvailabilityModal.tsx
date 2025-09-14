import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor } from "../../../types/doctor";
import { updateDoctorAvailability } from "../../../api/doctor";

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface DoctorAvailabilityProps {
  availabilityData: Doctor["availability"];
  setAvailabilityData: React.Dispatch<
    React.SetStateAction<Doctor["availability"]>
  >;
  userId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: (type: string, message: string[]) => void;
}

export const DoctorAvailabilityModal = ({
  availabilityData,
  setAvailabilityData,
  userId,
  setIsOpen,
  showNotification,
}: DoctorAvailabilityProps) => {
  const queryClient = useQueryClient();
  const updateAvailabilityMutation = useMutation({
    mutationFn: () =>
      updateDoctorAvailability({ availability: availabilityData, userId }),
    onSuccess: (newDoctor) => {
      queryClient.setQueryData(["doctors"], (oldDoctors: Doctor[]) => {
        if (!oldDoctors) return [];
        return oldDoctors.map((doctor) =>
          doctor.userId === userId ? newDoctor : doctor
        );
      });
      showNotification("success", ["Doctor schedule updated successfully"]);
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    },
    onError: (err: any) => {
      showNotification("error", err.response.data.message);
    },
  });
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Update Availability</h3>
        {weekDays.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-300 capitalize">{day}</div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                value={availabilityData[day]?.start || ""}
                onChange={(e) =>
                  setAvailabilityData((prev) => ({
                    ...prev,
                    [day]: {
                      ...prev[day],
                      start: e.target.value,
                    },
                  }))
                }
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={availabilityData[day]?.end || ""}
                onChange={(e) =>
                  setAvailabilityData((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], end: e.target.value },
                  }))
                }
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newAvailability = { ...availabilityData };
                  delete newAvailability[day];
                  setAvailabilityData(newAvailability);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button
          onClick={() => setIsOpen(false)}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          // onClick={() => handleSubmit("editAvailability")}
          onClick={() => updateAvailabilityMutation.mutate()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Availability
        </button>
      </div>
    </div>
  );
};
