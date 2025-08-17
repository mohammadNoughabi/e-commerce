import { Route, Routes } from "react-router-dom";
import CategoryEditor from "../pages/Category/CategoryEditor";

const CategoryRoutes = () => {
  return (
    <Routes>
      <Route path="/create" element={<CategoryEditor />} />
    </Routes>
  );
};

export default CategoryRoutes;
