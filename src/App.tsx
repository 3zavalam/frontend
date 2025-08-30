import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Waitlist from "./pages/Waitlist";
import TennisAnalysis from "./pages/TennisAnalysis";
import ContactUs from "./pages/ContactUs";
import AnalysisPage from "./pages/AnalysisPage";
import AnalysisResult from "./pages/AnalysisResult";
import DrillPlayground from "./pages/DrillPlayground";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/analysis" element={<TennisAnalysis />} />
        <Route path="/results" element={<AnalysisResult />} />
        <Route path="/drills" element={<DrillPlayground />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* cualquier ruta desconocida manda a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
