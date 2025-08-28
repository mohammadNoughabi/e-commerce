import { Route, Routes } from "react-router-dom";
import CategoryEditor from "../pages/Category/CategoryEditor";
import CategoryCreator from "../pages/Category/CategoryCreator";
import CategoryPage from "../pages/Category/CategoryPage";


const CategoryRoutes = () => {
  return (
    <Routes>
      <Route path="/:id" element={<CategoryPage />} />
      <Route path="/create" element={<CategoryCreator />} />
      <Route path="/edit/:id" element={<CategoryEditor />} />
    </Routes>
  );
};

export default CategoryRoutes;
