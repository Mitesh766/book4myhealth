import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAppointmentsDoctorWise,
  setAppointmentCancelled,
  setAppointmentCheckedIn,
  setAppointmentCompleted,
} from "../../api/appointment";
import { User, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckedInAppointments,
  CompletedAppointments,
  ScheduledAppointments,
} from "../../components/Admin";
import { Loader, Notification } from "../../components/ui";
import { useNotification } from "../../hooks/useNotification";


export const Appointments = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const { data, isLoading } = useQuery({
    queryKey: ["appointments", doctorId],
    queryFn: () => getAllAppointmentsDoctorWise(doctorId!),
    gcTime: 1000* 60 * 5,
    staleTime: 1000 * 60 * 5,
  });

  const doctor = data?.doctorDetails;
  const appointmentData = data?.finalAppointments;
  const {
    completedOrCancelledAppointments,
    checkedInOrWithDoctorAppointments,
    scheduledAppointments,
  } = useMemo(() => {
    const completedOrCancelledAppointments: any[] = [];
    const checkedInOrWithDoctorAppointments: any[] = [];
    const scheduledAppointments: any[] = [];

    
    appointmentData?.forEach((appt: any) => {
      const { status, completeTime, cancelTime, checkInTime, start, ...rest } =
        appt;

      if (status === "COMPLETED" || status === "CANCELLED") {
        completedOrCancelledAppointments.push({
          ...rest,
          status,
          time: status === "COMPLETED" ? completeTime : cancelTime, // keep only relevant
        });
      } else if (status === "CHECKED_IN" || status === "WITH_DOCTOR") {
        checkedInOrWithDoctorAppointments.push({
          ...rest,
          status,
          time: checkInTime,
        });
      } else if (status === "SCHEDULED") {
        scheduledAppointments.push({
          ...rest,
          status,
          time: start,
        });
      }
    });

    return {
      completedOrCancelledAppointments,
      checkedInOrWithDoctorAppointments,
      scheduledAppointments,
    };
  }, [appointmentData]);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const { showNotification, notification, hideNotification } =
    useNotification();

  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "walk-in":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "appointment":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "waiting":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const queryClient = useQueryClient();
  const checkInMutation = useMutation({
    mutationFn: () => setAppointmentCheckedIn(selectedAppointmentId),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(["appointments", doctorId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          finalAppointments: oldData.finalAppointments.map((app: any) =>
            app.id === selectedAppointmentId ? updatedAppointment : app
          ),
        };
      });
      showNotification("success", ["Appointment successfully checkedIn"]);
    },
    onError: () => {
      // handle error here if needed
    },
  });
  const completeMutation = useMutation({
    mutationFn: () => setAppointmentCompleted(selectedAppointmentId),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(["appointments", doctorId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          finalAppointments: oldData.finalAppointments.map((app: any) =>
            app.id === selectedAppointmentId ? updatedAppointment : app
          ),
        };
      });
      showNotification("success", [
        "Appointment successfully marked as completed",
      ]);
    },
    onError: (err: any) => {
      // handle error here if needed
      showNotification("error", err.response.data.message);
    },
  });
  const cancelMutation = useMutation({
    mutationFn: () => setAppointmentCancelled(selectedAppointmentId),
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(["appointments", doctorId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          finalAppointments: oldData.finalAppointments.map((app: any) =>
            app.id === selectedAppointmentId ? updatedAppointment : app
          ),
        };
      });
      showNotification("success", ["Appointment successfully cancelled"]);
    },
    onError: (err: any) => {
      // handle error here if needed
      showNotification("error", err.response.data.message);
    },
  });


  const onCheckIn = () => {
    checkInMutation.mutate();
  };
  const onComplete = () => {
    completeMutation.mutate();
  };
  const onCancel = () => {
    cancelMutation.mutate();
  };

  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen bg-gradient-to-br px-20 bg-slate-950 p-6">
      <Notification
        type={notification.type}
        messages={notification.messages}
        onClose={hideNotification}
        isVisible={notification.isVisible}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/frontdesk")}
            className="mb-4 px-4 py-2 cursor-pointer bg-amber-950-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200 text-gray-300 hover:text-white border border-gray-600/30"
          >
            ← Back to Doctors
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${"from-green-500 to-teal-600"} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              >
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {doctor?.name}
                </h1>
                <p className="text-gray-400 text-lg">{doctor?.specialisation}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      doctor?.available
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        doctor?.available ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    {doctor?.available ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/admin/add-appointment")}
                className="bg-gradient-to-r from-blue-500 cursor-pointer to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <ScheduledAppointments
          scheduledAppointments={scheduledAppointments}
          onCheckIn={onCheckIn}
          onCancel={onCancel}
          isCheckInPending={checkInMutation.isPending}
          isCancellationPending={cancelMutation.isPending}
          setSelectedAppointmentId={setSelectedAppointmentId}
          selectedAppointmentId={selectedAppointmentId}
        />

        {/* Queue Section */}
        <CheckedInAppointments
          checkedInOrWithDoctorAppointments={checkedInOrWithDoctorAppointments}
          getTypeColor={getTypeColor}
          onComplete={onComplete}
          onCancel={onCancel}
          isCompletionPending = {completeMutation.isPending}
          isCancellationPending = {cancelMutation.isPending}
          setSelectedAppointmentId={setSelectedAppointmentId}
          selectedAppointmentId={selectedAppointmentId}
        />
        {/* Completed Section */}
        <CompletedAppointments
          completedOrCancelledAppointments={completedOrCancelledAppointments}
          getTypeColor={getTypeColor}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );
};
