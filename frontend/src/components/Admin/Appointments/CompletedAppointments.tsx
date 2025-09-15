import { Check, X } from "lucide-react";

export const CompletedAppointments = ({
  completedOrCancelledAppointments,
  getTypeColor,
  getStatusColor,
}: any) => {
  return (
    completedOrCancelledAppointments.length > 0 && (
      <div className="bg-black-600/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-2">
            Completed & Cancelled
          </h2>
          <p className="text-gray-400">
            {completedOrCancelledAppointments.length} records
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            {completedOrCancelledAppointments.map((appointment: any) => (
              <div
                key={`${appointment.id}-${appointment.status}`}
                className="bg-black-400/30 rounded-lg p-4 border border-gray-600/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">
                    {appointment.patientName}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status === "COMPLETED" ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <X className="w-3 h-3 mr-1" />
                    )}
                    {appointment.status}
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  {appointment.status === "COMPLETED"
                    ? `Completed: ${appointment.time}`
                    : `Cancelled: ${appointment.time}`}
                </div>
                {appointment.type && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getTypeColor(
                      appointment.visitType
                    )}`}
                  >
                    {appointment.visitType}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};
