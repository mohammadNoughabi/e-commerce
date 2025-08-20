import { Route, Routes } from "react-router-dom";
import ProductCreator from "../pages/Product/ProductCreator";
import ProductEditor from "../pages/Product/ProductEditor";
import ProductPage from "../pages/Product/ProductPage";

const ProducRoutes = () => {
  return (
    <Routes>
      <Route path="/create" element={<ProductCreator />} />
      <Route path="/edit/:id" element={<ProductEditor />} />
      <Route path="/:id" element={<ProductPage />} />
    </Routes>
  );
};

export default ProducRoutes;
