import { ChevronRight, Eye, User, User2 } from "lucide-react";
import { getAllDoctorsCurrentStatus } from "../../api/doctor";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/ui";

const FrontDesk = () => {
  const { data: doctorData, isLoading } = useQuery({
    queryKey: ["doctors-current-status"],
    queryFn: getAllDoctorsCurrentStatus,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br bg-slate-950 p-6 px-15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Clinic Front Desk
          </h1>
          <p className="text-gray-400 text-lg"></p>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-800/30 p-1 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <button
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200`}
          >
            <div className="flex items-center text-white font-bold justify-center space-x-2">
              <User className="w-5 h-5" />
              <span>Doctors & Schedules</span>
            </div>
          </button>
        </div>

        {/* Doctors Section */}

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorData?.map((doctor: any) => {
              return (
                <div
                  key={doctor.doctorId}
                  className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${doctor.color} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      <User2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                        {doctor.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {doctor.specialisation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Status</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.available
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            doctor.available ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        {doctor.available ? "Available" : "Not Available"}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/appointments?doctorId=${doctor.doctorId}`
                        )
                      }
                      className="w-full mt-4 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Manage Schedule</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontDesk;
