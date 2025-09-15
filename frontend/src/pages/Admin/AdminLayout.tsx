import {

  Calendar,

  Computer,

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
      label: "FrontDesk",
      path: "frontdesk",
      icon: <Computer size={18} />,
    },

    { label: "Patients", path: "patients", icon: <Users size={18} /> },
    { label: "Doctors", path: "doctors", icon: <UserCheck size={18} /> },
    {
      label: "Add Appointment",
      path: "add-appointment",
      icon: <Calendar size={18} />,
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
