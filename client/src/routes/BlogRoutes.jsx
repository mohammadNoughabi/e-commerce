import { Route, Routes } from "react-router-dom";
import BlogEditor from "../pages/Blog/BlogEditor";
import BlogList from "../pages/Blog/BlogList";
import Blog from "../pages/Blog/Blog";

const BlogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/:id" element={<Blog />} />
      <Route path="/create" element={<BlogEditor />} />
    </Routes>
  );
};

export default BlogRoutes;
