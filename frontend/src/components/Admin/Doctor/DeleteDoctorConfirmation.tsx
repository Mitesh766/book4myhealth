import React from "react";
import { ConfirmationModal } from "../../ui/ConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoctor } from "../../../api/doctor";
import type { Doctor } from "../../../types/doctor";

interface DeleteConfirmationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  showNotification: (type: string, messages: string[]) => void;
}

export const DeleteDoctorConfirmation = ({
  isOpen,
  setIsOpen,
  userId,
  showNotification,
}: DeleteConfirmationProps) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteDoctor(userId),
    onSuccess: () => {
      queryClient.setQueryData(["doctors"], (oldDoctors: Doctor[]) => {
        if (!oldDoctors) return [];
        return oldDoctors.filter((doctor) => doctor.userId !== userId);
      });
      setIsOpen(false);
      showNotification("success", ["Doctor data deleted successfully"]);
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
      message="Are you sure you want to delete the doctor data"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isPending={deleteMutation.isPending}
    />
  );
};
