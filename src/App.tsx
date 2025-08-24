import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Waitlist from "./pages/Waitlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / redirige directo a /waitlist */}
        <Route path="/" element={<Navigate to="/waitlist" replace />} />
        <Route path="/waitlist" element={<Waitlist />} />

        {/* opcional: cualquier ruta desconocida manda a /waitlist */}
        <Route path="*" element={<Navigate to="/waitlist" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
