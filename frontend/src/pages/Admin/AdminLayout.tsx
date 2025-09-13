import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  Users,
} from "lucide-react";
import { Sidebar } from "../../components/ui";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export const AdminLayout = () => {
  const [currentPath, setCurrentPath] = useState("/appointments");
  interface SidebarOption {
    label: string;
    path: string;
    icon: React.ReactNode;
  }

  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(`${path}`);
  };

  const sidebarOptions: SidebarOption[] = [
    {
      label: "Appointments",
      path: "/appointments",
      icon: <Calendar size={18} />,
    },
    { label: "Patients", path: "/patients", icon: <Users size={18} /> },
    { label: "Doctors", path: "/doctors", icon: <UserCheck size={18} /> },
    {
      label: "Prescriptions",
      path: "/prescriptions",
      icon: <FileText size={18} />,
    },
    { label: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
    { label: "Analytics", path: "/analytics", icon: <BarChart3 size={18} /> },
    {
      label: "Appointment History",
      path: "/history",
      icon: <Clock size={18} />,
    },
  ];
  return (
    <div>
      <Outlet/>
      <Sidebar
        options={sidebarOptions}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
