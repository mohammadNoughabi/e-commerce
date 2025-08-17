import { Route, Routes } from "react-router-dom";
import ProductEditor from "../pages/Product/ProductEditor";
import Shop from "../pages/Product/Shop";
import ProductPage from "../pages/Product/ProductPage";

const ProducRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/:id" element={<ProductPage />} />
      <Route path="/create" element={<ProductEditor />} />
    </Routes>
  );
};

export default ProducRoutes;
