import React, { useState } from "react";
import {
  X,
  Plus,
  Edit,
  Clock,
  Trash2,
  User,
  Mail,
  Phone,
  Stethoscope,
  Timer,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Types
interface Availability {
  [key: string]: {
    start: string;
    end: string;
  };
}

interface User {
  name: string;
  email: string;
  phoneNo: string;
}

interface Doctor {
  userId: string;
  gender: string;
  specialisation: string;
  isActive: boolean;
  avgTimePerPatient: number;
  availability: Availability;
  createdAt: string;
  user: User;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

// Mock data
const mockDoctors: Doctor[] = [
  {
    userId: "ed888c2c-9a06-4d41-9b0f-b9ec89dedba1",
    gender: "Female",
    specialisation: "ENT",
    isActive: true,
    avgTimePerPatient: 20,
    availability: {
      monday: { start: "11:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "09:00", end: "17:00" },
    },
    createdAt: "2025-09-13T05:56:16.639Z",
    user: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phoneNo: "9876543210",
    },
  },
  {
    userId: "f7b9a3d1-2e4f-4c8b-9a1d-5e3f7b9c2d1a",
    gender: "Male",
    specialisation: "Cardiology",
    isActive: true,
    avgTimePerPatient: 30,
    availability: {
      monday: { start: "08:00", end: "16:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "09:00", end: "15:00" },
    },
    createdAt: "2025-09-12T08:30:45.123Z",
    user: {
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      phoneNo: "8765432109",
    },
  },
];

// Notification Component
const NotificationComponent: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-900/20 border-green-500/30 text-green-400";
      case "error":
        return "bg-red-900/20 border-red-500/30 text-red-400";
      case "warning":
        return "bg-yellow-900/20 border-yellow-500/30 text-yellow-400";
      default:
        return "bg-blue-900/20 border-blue-500/30 text-blue-400";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 ${getColors(
            notification.type
          )} max-w-sm`}
        >
          {getIcon(notification.type)}
          <span className="flex-1 text-sm">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning";
}> = ({ isOpen, onClose, onConfirm, title, message, type = "warning" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const Doctor = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modals, setModals] = useState({
    add: false,
    editPersonal: false,
    editAvailability: false,
    delete: false,
  });
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    gender: "",
    specialisation: "",
    avgTimePerPatient: 20,
    isActive: true,
    availability: {} as Availability,
  });


  const addNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    const id = Date.now().toString();
    const notification = { id, type, message };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNo: "",
      gender: "",
      specialisation: "",
      avgTimePerPatient: 20,
      isActive: true,
      availability: {},
    });
  };

  const openModal = (type: keyof typeof modals, doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      if (type === "editPersonal") {
        setFormData({
          name: doctor.user.name,
          email: doctor.user.email,
          phoneNo: doctor.user.phoneNo,
          gender: doctor.gender,
          specialisation: doctor.specialisation,
          avgTimePerPatient: doctor.avgTimePerPatient,
          isActive: doctor.isActive,
          availability: {},
        });
      } else if (type === "editAvailability") {
        setFormData((prev) => ({
          ...prev,
          availability: doctor.availability,
        }));
      }
    } else {
      resetForm();
    }
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedDoctor(null);
    resetForm();
  };

  const handleSubmit = (
    action: "add" | "editPersonal" | "editAvailability"
  ) => {
    if (action === "add") {
      const newDoctor: Doctor = {
        userId: `doctor-${Date.now()}`,
        gender: formData.gender,
        specialisation: formData.specialisation,
        isActive: formData.isActive,
        avgTimePerPatient: formData.avgTimePerPatient,
        availability: formData.availability,
        createdAt: new Date().toISOString(),
        user: {
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo,
        },
      };
      setDoctors((prev) => [...prev, newDoctor]);
      addNotification("success", "Doctor added successfully");
      closeModal("add");
    } else if (action === "editPersonal" && selectedDoctor) {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.userId === selectedDoctor.userId
            ? {
                ...doc,
                gender: formData.gender,
                specialisation: formData.specialisation,
                avgTimePerPatient: formData.avgTimePerPatient,
                isActive: formData.isActive,
                user: {
                  name: formData.name,
                  email: formData.email,
                  phoneNo: formData.phoneNo,
                },
              }
            : doc
        )
      );
      addNotification(
        "success",
        "Doctor personal details updated successfully"
      );
      closeModal("editPersonal");
    } else if (action === "editAvailability" && selectedDoctor) {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.userId === selectedDoctor.userId
            ? { ...doc, availability: formData.availability }
            : doc
        )
      );
      addNotification("success", "Doctor availability updated successfully");
      closeModal("editAvailability");
    }
  };

  const handleDelete = () => {
    if (selectedDoctor) {
      setDoctors((prev) =>
        prev.filter((doc) => doc.userId !== selectedDoctor.userId)
      );
      addNotification("success", "Doctor deleted successfully");
      closeModal("delete");
    }
  };

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const DoctorForm = ({ type }: { type: "add" | "editPersonal" }) => (
    <div className="space-y-6">
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

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-gray-300">
          Active Status
        </label>
      </div>

      {type === "add" && (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Availability</h3>
          <div className="space-y-3">
            {weekDays.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-300 capitalize">
                  {day}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={formData.availability[day]?.start || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          [day]: {
                            ...prev.availability[day],
                            start: e.target.value,
                          },
                        },
                      }))
                    }
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    value={formData.availability[day]?.end || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          [day]: {
                            ...prev.availability[day],
                            end: e.target.value,
                          },
                        },
                      }))
                    }
                    className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newAvailability = { ...formData.availability };
                      delete newAvailability[day];
                      setFormData((prev) => ({
                        ...prev,
                        availability: newAvailability,
                      }));
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
        <button
          onClick={() => closeModal(type === "add" ? "add" : "editPersonal")}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(type)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {type === "add" ? "Add Doctor" : "Update Details"}
        </button>
      </div>
    </div>
  );

  const AvailabilityForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Update Availability</h3>
        {weekDays.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-300 capitalize">{day}</div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                value={formData.availability[day]?.start || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      [day]: {
                        ...prev.availability[day],
                        start: e.target.value,
                      },
                    },
                  }))
                }
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={formData.availability[day]?.end || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      [day]: { ...prev.availability[day], end: e.target.value },
                    },
                  }))
                }
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newAvailability = { ...formData.availability };
                  delete newAvailability[day];
                  setFormData((prev) => ({
                    ...prev,
                    availability: newAvailability,
                  }));
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
          onClick={() => closeModal("editAvailability")}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit("editAvailability")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Availability
        </button>
      </div>
    </div>
  );

  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-center  mb-8">
          <div className="px-15">
            <h1 className="text-md sm:text-3xl font-bold text-white mb-2">
              Doctor Management
            </h1>
          </div>
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </button>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.userId}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {doctor.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
                    <Stethoscope className="w-4 h-4" />
                    {doctor.specialisation}
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      doctor.isActive
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {doctor.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <User className="w-4 h-4" />
                  {doctor.gender}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Mail className="w-4 h-4" />
                  {doctor.user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Phone className="w-4 h-4" />
                  {doctor.user.phoneNo}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Timer className="w-4 h-4" />
                  {doctor.avgTimePerPatient} mins per patient
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Availability
                </h4>
                <div className="space-y-1">
                  {Object.entries(doctor.availability).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="text-gray-400 capitalize">{day}</span>
                      <span className="text-gray-300">
                        {time.start} - {time.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal("editPersonal", doctor)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Edit Details
                </button>
                <button
                  onClick={() => openModal("editAvailability", doctor)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  Availability
                </button>
                <button
                  onClick={() => openModal("delete", doctor)}
                  className="flex items-center justify-center bg-red-900/20 hover:bg-red-900/30 px-3 py-2 rounded text-xs transition-colors text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Stethoscope className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No doctors found</h3>
              <p>Add your first doctor to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modals.add}
        onClose={() => closeModal("add")}
        title="Add New Doctor"
      >
        <DoctorForm type="add" />
      </Modal>

      <Modal
        isOpen={modals.editPersonal}
        onClose={() => closeModal("editPersonal")}
        title="Edit Personal Details"
      >
        <DoctorForm type="editPersonal" />
      </Modal>

      <Modal
        isOpen={modals.editAvailability}
        onClose={() => closeModal("editAvailability")}
        title="Edit Availability"
      >
        <AvailabilityForm />
      </Modal>

      <ConfirmationModal
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${selectedDoctor?.user.name}? This action cannot be undone.`}
        type="danger"
      />

      {/* Notifications */}
      <NotificationComponent
        notifications={notifications}
        onRemove={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      />
    </div>
  );
};
