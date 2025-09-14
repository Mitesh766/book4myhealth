import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, Login } from "./pages";
import {
  AdminLayout,
  Appointments,
  Doctor,
  Patient,
  Prescription,
} from "./pages/Admin";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="patient" element={<Patient />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescription" element={<Prescription />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
