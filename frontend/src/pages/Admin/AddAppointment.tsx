import { useState } from "react";
import { Calendar, Clock, User, UserCheck, AlertTriangle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "../../api/doctor";
import { createAppointment } from "../../api/appointment";
import { Notification } from "../../components/ui";
import { useNotification } from "../../hooks/useNotification";

export const AddAppointment = () => {
  const { data: doctorData } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: () => createAppointment(appointment),
    onSuccess: () => {
      showNotification("success", ["Appointment added successfully"]);
      setAppointment({
        patientCustomId: "",
        doctorId: "",
        visitType: "Appointment",
        status: "SCHEDULED",
        start: "",
        end: "",
      });
    },
    onError: (err: any) => {
      showNotification("error", err.response.data.message);
    },
  });
  const [appointment, setAppointment] = useState({
    patientCustomId: "",
    doctorId: "",
    visitType: "Appointment",
    status: "SCHEDULED",
    start: "null",
    end: "",
  });

  // Mock doctors data

  const visitTypes = ["Appointment", "Emergency", "WalkIn"];
  const appointmentStatuses = ["SCHEDULED", "CHECKED_IN"];

  const handleInputChange = (field: any, value: any) => {
    const updatedAppointment = { ...appointment, [field]: value };

    // Auto-set status based on appointment type
    if (field === "visitType") {
      if (value === "Appointment") {
        updatedAppointment.status = "SCHEDULED";
      } else if (value === "Emergency" || value === "WalkIn") {
        updatedAppointment.status = "CHECKED_IN";
      }
    }

    setAppointment(updatedAppointment);
  };

  const getSelectedDoctor = () => {
    return doctorData?.find(
      (doctor: any) => doctor.userId === appointment.doctorId
    );
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

 

 

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMERGENCY":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "WALKIN":
        return <User className="w-4 h-4 text-blue-600" />;
      default:
        return <Calendar className="w-4 h-4 text-green-600" />;
    }
  };

  const handleSubmit = () => {
    createAppointmentMutation.mutate();
  };
  const { showNotification, notification, hideNotification } =
    useNotification();

  return (
    <div className="max-w-full px-[20%] mx-auto p-6 bg-slate-950">
      <Notification
        type={notification.type}
        messages={notification.messages}
        onClose={hideNotification}
        isVisible={notification.isVisible}
      />
      <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="w-6 h-6" />
          New Appointment
        </h1>
        <p className="text-blue-100 mt-2">
          Create and manage patient appointments
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-b-lg space-y-6">
        {/* Patient ID */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient ID *
          </label>
          <input
            type="text"
            value={appointment.patientCustomId}
            onChange={(e) =>
              handleInputChange("patientCustomId", e.target.value)
            }
            placeholder="Enter patient ID (e.g., PAT001)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Doctor Selection */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Doctor *
          </label>
          <select
            value={appointment.doctorId}
            onChange={(e) => handleInputChange("doctorId", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a doctor...</option>
            {doctorData?.map((doctor: any) => (
              <option key={doctor.userId} value={doctor.userId}>
                {doctor.name} - {doctor.specialisation}
              </option>
            ))}
          </select>

          {getSelectedDoctor() && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {getSelectedDoctor().name}
              </p>
              <p className="text-sm text-blue-600">
                Specialty: {getSelectedDoctor().specialisation}
              </p>
            </div>
          )}
        </div>

        {/* Appointment Type */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {visitTypes.map((type) => (
              <label key={type} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="visitType"
                  value={type}
                  checked={appointment.visitType === type}
                  onChange={(e) =>
                    handleInputChange("visitType", e.target.value)
                  }
                  className="sr-only"
                />
                <div
                  className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    appointment.visitType === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {getTypeIcon(type)}
                  <span className="font-medium">{type}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Appointment Status */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Status
          </label>
          <select
            value={appointment.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {appointmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>

          <div className="mt-3">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border`}
            >
              {appointment.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Date & Time Selection (only for APPOINTMENT type) */}
        {appointment.visitType === "Appointment" && (
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Schedule Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={appointment.start}
                  onChange={(e) => handleInputChange("start", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={appointment.end}
                  onChange={(e) => handleInputChange("end", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={appointment.start}
                />
              </div>
            </div>

            {appointment.start && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Scheduled for:</strong>{" "}
                  {formatDateTime(appointment.start)}
                </p>
                {appointment.end && (
                  <p className="text-sm text-green-700">
                    <strong>Until:</strong> {formatDateTime(appointment.end)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() =>
              setAppointment({
                patientCustomId: "",
                doctorId: "",
                visitType: "APPOINTMENT",
                status: "SCHEDULED",
                start: "",
                end: "",
              })
            }
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Save Appointment
          </button>
        </div>
      </div>

      {/* Appointment Summary */}
      {appointment.patientCustomId && appointment.doctorId && (
        <div className="mt-6 bg-white border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Appointment Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Patient ID:</strong> {appointment.patientCustomId}
              </p>
              <p>
                <strong>Doctor:</strong> {getSelectedDoctor()?.name}
              </p>
              <p>
                <strong>Type:</strong> {appointment.visitType}
              </p>
            </div>
            <div>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full`}
                >
                  {appointment.status.replace("_", " ")}
                </span>
              </p>
              {appointment.visitType === "APPOINTMENT" && appointment.start && (
                <p>
                  <strong>Scheduled:</strong>{" "}
                  {formatDateTime(appointment.start)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
