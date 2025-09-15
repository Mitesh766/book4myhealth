import { AlertCircle, Check, Users, X } from "lucide-react";

export const CheckedInAppointments = ({
  checkedInOrWithDoctorAppointments,
  getTypeColor,
  setSelectedAppointmentId,
  onComplete,
  onCancel,
}: any) => {
  return (
    <div className="bg-black-600/50 backdrop-blur-sm mb-10 rounded-2xl border border-gray-700/50 shadow-2xl">
      <div className="p-6 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-2">Patient Queue</h2>
        <p className="text-gray-400">
          {checkedInOrWithDoctorAppointments.length} patients waiting
        </p>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {checkedInOrWithDoctorAppointments.map((appointment: any) => (
          <div
            key={appointment.id}
            className="bg-black-400/30 rounded-xl p-4 border border-gray-600/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
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
              <div className="flex  flex-col items-end space-y-1">
                <span
                  className={`inline-flex bg-red-600 text-white items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                    appointment.visitType
                  )}`}
                >
                  {appointment.visitType === "EMERGENCY" && (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {appointment.visitType}
                </span>
                <span className="text-gray-400 text-xs">
                  Checked in: {appointment.time}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedAppointmentId(appointment.id);
                    onComplete();
                  }}
                  className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedAppointmentId(appointment.id);
                    onCancel();
                  }}
                  className="bg-orange-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {checkedInOrWithDoctorAppointments.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No patients in queue</p>
          </div>
        )}
      </div>
    </div>
  );
};
