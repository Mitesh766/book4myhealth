import { Calendar, Clock} from "lucide-react";

export const ScheduledAppointments = ({
  scheduledAppointments,
  onCheckIn,
  onCancel,
  setSelectedAppointmentId,
  isCheckInPending,
  isCancellationPending,
  selectedAppointmentId
}: any) => {
  return (
    <div className="bg-black-600/50 mb-10 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl">
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-2">
          Scheduled Appointments
        </h2>
        <p className="text-gray-400">
          {scheduledAppointments.length} appointments scheduled
        </p>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {scheduledAppointments.map((appointment: any) => (
          <div
            key={appointment.id}
            className="bg-black-400/30 rounded-xl p-4 border border-gray-600/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {appointment.patientName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {appointment.patientName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {appointment.patientPhoneNo}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-medium">
                  {appointment.time}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedAppointmentId(appointment.id);
                    onCheckIn();
                  }}
                  className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                {selectedAppointmentId === appointment.id &&
                  isCheckInPending ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                      Checking In...
                    </>
                  ) : (
                    <>
                      {" "}
                      <span>CheckIn</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedAppointmentId(appointment.id);
                    onCancel();
                  }}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  {selectedAppointmentId === appointment.id &&
                  isCancellationPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      {" "}
                      
                      Cancel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {scheduledAppointments.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No scheduled appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};
