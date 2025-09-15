import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages";
import {
  AddAppointment,
  AdminLayout,
  Appointments,
  Doctors,
  Patients,
} from "./pages/Admin";
import FrontDesk from "./pages/Admin/FrontDesk";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="frontdesk" element={<FrontDesk />} />
            <Route path="patients" element={<Patients />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="add-appointment" element={<AddAppointment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
