import React from "react";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatient } from "../../../api/patient";
import type { PatientResponse } from "../../../types/patient";

interface DeleteConfirmationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  showNotification: (type: string, messages: string[]) => void;
}

export const DeletePatientConfirmation = ({
  isOpen,
  setIsOpen,
  userId,
  showNotification,
}: DeleteConfirmationProps) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deletePatient(userId),
    onSuccess: () => {
      queryClient.setQueryData(
        ["patients"],
        (oldPatients: PatientResponse[]) => {
          if (!oldPatients) return [];
          return oldPatients.filter((patient) => patient.id !== userId);
        }
      );
      setIsOpen(false);
      showNotification("success", ["Patient data deleted successfully"]);
    },
    onError: (err: any) => {
      setIsOpen(false);
      showNotification("error", [err.response.data.message]);
    },
  });
  return (
    <ConfirmationModal
      onConfirm={() => deleteMutation.mutate()}
      title="Delete doctor data"
      message="Are you sure you want to delete the patient data"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPending={deleteMutation.isPending}
    />
  );
};
