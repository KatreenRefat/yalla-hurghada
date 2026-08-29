import { Routes, Route } from "react-router-dom";
import Tours from "../pages/Tours/Tours";
import ModelPage from "../pages/ModelPage/Model";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<Tours />} />
      <Route path="/tours"      element={<Tours />} />
      <Route path="/model/:id"  element={<ModelPage />} />
    </Routes>
  );
}
