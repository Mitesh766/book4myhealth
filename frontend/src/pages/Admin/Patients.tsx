import { Loader2, Search } from "lucide-react";
import { Modal, Notification } from "../../components/ui";
import { useNotification } from "../../hooks/useNotification";
import { useMemo, useState } from "react";
import type { PatientResponse } from "../../types/patient";
import { useQuery } from "@tanstack/react-query";
import {
  AddPatientModal,
  DeletePatientConfirmation,
  PatientCard,
  UpdatePatientModal,
} from "../../components/Admin";
import { getAllPateints } from "../../api/patient";
import { AxiosError } from "axios";

export const Patients = () => {
  const { showNotification, notification, hideNotification } =
    useNotification();

  const [formData, setFormData] = useState<{
    name: string;
    phoneNo: string;
    gender: "Male" | "Female" | "Other";
    address: string;
    id: string;
  }>({
    name: "",
    phoneNo: "",
    gender: "Male",
    address: "",
    id: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const {
    data: patientData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getAllPateints(),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });

  const patients = useMemo(() => {
    if (!patientData) return [];
    return patientData.filter((p: PatientResponse) => {
      return (
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.customId.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.phoneNo.includes(searchInput)
      );
    });
  }, [searchInput, patientData]);

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] =
    useState<boolean>(false);
  const [isUpdatePatientModalOpen, setIsUpdatePatientModalOpen] =
    useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-950 px-14 ">
      <Notification
        type={notification.type}
        messages={notification.messages}
        onClose={hideNotification}
        isVisible={notification.isVisible}
      />
      // Header
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white  text-xl sm:text-3xl font-bold">
          Patient Management
        </h2>
        <button
          onClick={() => setIsAddPatientModalOpen(true)}
          className="cursor-pointer text-white bg-blue-700 font-bold px-4 py-2 rounded-lg"
        >
          Add Patient
        </button>
      </div>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={`Search by name or PatientId or phone number`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full  pl-10 text-white pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      {/* Patient List */}
      <div className="transition-all duration-300">
        {isLoading && (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        )}
        {isError && (
          <div className="text-center p-10 text-red-400 bg-red-900/50 rounded-lg">
            {(error as AxiosError<{ message: string }>)?.response?.data
              ?.message ?? "Something went wrong"}
          </div>
        )}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients?.map((patient: PatientResponse) => {
              const { name, phoneNo, address, gender, id } = patient;
              return (
                <PatientCard
                  key={id}
                  patient={patient}
                  onEdit={() => {
                    setFormData({ name, phoneNo, address, gender, id });
                    setIsUpdatePatientModalOpen(true);
                  }}
                  onDelete={() => {
                    setSelectedPatientId(id);
                    setIsDeleteConfirmationOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}
        {!isLoading && !isError && patients?.length === 0 && (
          <div className="text-center p-10 text-gray-500 bg-gray-900/50 rounded-lg">
            No patients found.
          </div>
        )}
      </div>
      {isAddPatientModalOpen && (
        <Modal
          isOpen={isAddPatientModalOpen}
          setIsOpen={setIsAddPatientModalOpen}
          title="Add Doctor"
          children={
            <AddPatientModal setIsModalOpen={setIsAddPatientModalOpen} />
          }
        />
      )}
      {isUpdatePatientModalOpen && (
        <Modal
          isOpen={isUpdatePatientModalOpen}
          setIsOpen={setIsUpdatePatientModalOpen}
          title="Update Doctor Details"
        >
          <UpdatePatientModal
            formData={formData}
            setFormData={setFormData}
            setIsModalOpen={setIsUpdatePatientModalOpen}
          />
        </Modal>
      )}
      
      {isDeleteConfirmationOpen && (
        <DeletePatientConfirmation
          isOpen={isDeleteConfirmationOpen}
          setIsOpen={setIsDeleteConfirmationOpen}
          userId={selectedPatientId}
          showNotification={showNotification}
        />
      )}
      {/* {isAddPatientModalOpen && <AddPatientModal isOpen={isAddPatientModalOpen} setIsOpen ={setIsAddPatientModalOpen}/>} */}
    </div>
  );
};
