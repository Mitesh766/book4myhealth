import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Edit,
  Mail,
  Phone,
  Stethoscope,
  Timer,
  Trash2,
  User,
} from "lucide-react";
import { getAllDoctors } from "../../api/doctor";
import type { Doctor as DoctorType } from "../../types/doctor";
import { useState } from "react";
import { Loader, Modal, Notification } from "../../components/ui";
import { useNotification } from "../../hooks/useNotification";
import {
  DoctorAvailabilityModal,
  DeleteDoctorConfirmation,
  UpdateDoctorDetailsModal,
  AddDoctorModal,
} from "../../components/Admin";

export const Doctors = () => {
  const { data: doctorData, isLoading: isDoctorDataLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    gender: "",
    specialisation: "",
    avgTimePerPatient: 20,
    isActive: true,
  });

  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] =
    useState<boolean>(false);

  const [isUpdateDoctorDetailsModalOpen, setIsUpdateDoctorDetailsModalOpen] =
    useState<boolean>(false);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false);

  const [isDoctorAvailabilityModalOpen, setIsDoctorAvailabilityModalOpen] =
    useState<boolean>(false);

  const { showNotification, notification, hideNotification } =
    useNotification();

  return (
    <div className="min-h-screen bg-gray-950 px-14 py-6">
      <Notification
        type={notification.type}
        messages={notification.messages}
        onClose={hideNotification}
        isVisible={notification.isVisible}
      />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white  text-xl sm:text-3xl font-bold">
          Doctor Management
        </h2>
        <button
          onClick={() => setIsAddDoctorModalOpen(true)}
          className="cursor-pointer text-white bg-blue-700 font-bold px-4 py-2 rounded-lg"
        >
          Add Doctor
        </button>
      </div>

      {isDoctorDataLoading && <Loader />}
      {doctorData && doctorData?.length === 0 && (
        <div className="text-center">
          <div className="text-gray-500 relative top-40">
            <Stethoscope className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No doctors found</h3>
            <p>Add your first doctor to get started</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctorData?.map((doctor: DoctorType) => {
          const { userId, ...rest } = doctor;

          return (
            <div
              key={userId}
              onClick={() => {
                setFormData(rest);
              }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {doctor.name}
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
                  {doctor.email}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Phone className="w-4 h-4" />
                  {doctor.phoneNo}
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
                  {doctor?.availability &&
                    Object.entries(doctor?.availability)?.map(([day, time]) => (
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
                  onClick={() => {
                    setSelectedDoctorId(doctor.userId);
                    setIsUpdateDoctorDetailsModalOpen(true);
                  }}
                  className="flex-1 cursor-pointer text-white flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  Edit Details
                </button>
                <button
                  className="flex-1 cursor-pointer text-white flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition-colors"
                  onClick={() => {
                    setAvailabilityData(doctor.availability);
                    setSelectedDoctorId(doctor.userId);
                    setIsDoctorAvailabilityModalOpen(true);
                  }}
                >
                  <Clock className="w-3 h-3" />
                  Availability
                </button>
                <button
                  onClick={() => {
                    setIsDeleteConfirmationOpen(true);
                    setSelectedDoctorId(doctor.userId);
                  }}
                  className="flex cursor-pointer items-center justify-center bg-red-900/20 hover:bg-red-900/30 px-3 py-2 rounded text-xs transition-colors text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {isAddDoctorModalOpen && (
        <Modal
          isOpen={isAddDoctorModalOpen}
          setIsOpen={setIsAddDoctorModalOpen}
          title="Add Doctor"
          children={<AddDoctorModal setIsModalOpen={setIsAddDoctorModalOpen} />}
        />
      )}
      {isUpdateDoctorDetailsModalOpen && (
        <Modal
          isOpen={isUpdateDoctorDetailsModalOpen}
          setIsOpen={setIsUpdateDoctorDetailsModalOpen}
          title="Update Doctor Details"
        >
          <UpdateDoctorDetailsModal
            formData={formData}
            setFormData={setFormData}
            setIsModalOpen={setIsUpdateDoctorDetailsModalOpen}
            userId={selectedDoctorId}
          />
        </Modal>
      )}

      {isDeleteConfirmationOpen && (
        <DeleteDoctorConfirmation
          isOpen={isDeleteConfirmationOpen}
          setIsOpen={setIsDeleteConfirmationOpen}
          userId={selectedDoctorId}
          showNotification={showNotification}
        />
      )}

      {isDoctorAvailabilityModalOpen && (
        <Modal
          isOpen={isDoctorAvailabilityModalOpen}
          setIsOpen={setIsDoctorAvailabilityModalOpen}
          title="Edit Schedule"
        >
          <DoctorAvailabilityModal
            availabilityData={availabilityData}
            setAvailabilityData={setAvailabilityData}
            userId={selectedDoctorId}
            setIsOpen={setIsDoctorAvailabilityModalOpen}
            showNotification={showNotification}
          />
        </Modal>
      )}
    </div>
  );
};
