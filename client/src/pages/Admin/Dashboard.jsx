import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/api";
import { setUsers } from "../../store/user/userSlice";
import { format } from "date-fns";
import { removeCategory } from "../../store/category/categorySlice";
import { removeProduct } from "../../store/product/productSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userRole } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/user");
      dispatch(setUsers(res.data.users));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
      </div>
    );
  }

  const handleDelete = async (id, type) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14213d",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          let res = await api.delete(`/api/${type}/${id}`);
          if (res.status === 200 && type === "category") {
            dispatch(removeCategory(id));
          }
          if (res.status === 200 && type === "product") {
            dispatch(removeProduct(id));
          }
          Swal.fire("Deleted!", res.data.message, "success");
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const tableHeight = "h-64";

  return (
    <div className="min-h-screen bg-light-gray text-dark-blue p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent-orange"></div>
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-10 text-dark-blue">
        Admin Dashboard
      </h1>

      {/* Users */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-light-gray">
        <h2 className="text-2xl font-semibold mb-4 text-dark-blue">Users</h2>
        <div
          className={`w-full border overflow-y-auto ${tableHeight} rounded-lg`}
        >
          <table className="w-full text-sm">
            <thead className="bg-light-gray sticky top-0">
              <tr className="text-left">
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
              </tr>
            </thead>
            <tbody>
              {users?.length ? (
                users.map((u, i) => (
                  <tr
                    key={i}
                    className="hover:bg-accent-orange/10 transition border-b"
                  >
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border">{u.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-light-gray">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-dark-blue">Categories</h2>
          <button
            onClick={() => navigate("/category/create")}
            className="accent-theme px-4 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New
          </button>
        </div>
        <div
          className={`w-full border overflow-y-auto ${tableHeight} rounded-lg`}
        >
          <table className="w-full text-sm">
            <thead className="bg-light-gray sticky top-0">
              <tr className="text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length ? (
                categories.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-accent-orange/10 transition border-b"
                  >
                    <td className="p-3 border">{c.title}</td>
                    <td className="p-3 border">
                      {format(new Date(c.createdAt), "PPP")}
                    </td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <Link
                          to={`/category/edit/${c._id}`}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c._id, "category")}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-light-gray">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-dark-blue">Products</h2>
          <button
            onClick={() => navigate("/product/create")}
            className="accent-theme px-4 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> New
          </button>
        </div>
        <div
          className={`w-full border overflow-y-auto ${tableHeight} rounded-lg`}
        >
          <table className="w-full text-sm">
            <thead className="bg-light-gray sticky top-0">
              <tr className="text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Stock</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.length ? (
                products.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-accent-orange/10 transition border-b"
                  >
                    <td className="p-3 border">{p.title}</td>
                    <td className="p-3 border">${p.price}</td>
                    <td className="p-3 border">{p.stock}</td>
                    <td className="p-3 border">
                      <div className="flex gap-2">
                        <Link
                          to={`/product/${p._id}`}
                          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/product/edit/${p._id}`}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, "product")}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
