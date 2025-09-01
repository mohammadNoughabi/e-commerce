import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Edit,
  Eye,
  Trash2,
  Plus,
  Users,
  FolderOpen,
  Package,
  BarChart3,
  Search,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

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
      <div className="flex items-center justify-center min-h-screen bg-light-gray">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-light-gray">
          <h2 className="text-3xl font-bold text-dark-blue mb-4">
            Access Denied
          </h2>
          <p className="text-dark-blue/70 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-accent-orange text-dark-blue px-6 py-2 rounded-lg font-medium hover:bg-accent-orange/90 transition-colors cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id, type, name) => {
    Swal.fire({
      title: `Delete ${type}?`,
      text: `Are you sure you want to delete "${name}"? This action cannot be undone!`,
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
            dispatch(removeCategory(res.data.id));
          }
          if (res.status === 200 && type === "product") {
            dispatch(removeProduct(res.data.id));
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

  // Filter data based on search term
  const filteredProducts =
    products?.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredCategories =
    categories?.filter((category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredUsers =
    users?.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-light-gray text-dark-blue p-4 md:p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-dark-blue/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-accent-orange mb-4"></div>
            <p className="text-dark-blue">Processing...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-2">
              Admin Dashboard
            </h1>
            <p className="text-dark-blue/70">Manage your store efficiently</p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-blue/50" />
            <input
              type="text"
              placeholder="Search users, categories, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
            />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-light-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-blue/70 text-sm">Total Users</p>
                <h3 className="text-3xl font-bold text-dark-blue mt-1">
                  {users?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-accent-orange/10 rounded-full">
                <Users className="w-6 h-6 text-accent-orange" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-light-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-blue/70 text-sm">Total Categories</p>
                <h3 className="text-3xl font-bold text-dark-blue mt-1">
                  {categories?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-accent-orange/10 rounded-full">
                <FolderOpen className="w-6 h-6 text-accent-orange" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-light-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-blue/70 text-sm">Total Products</p>
                <h3 className="text-3xl font-bold text-dark-blue mt-1">
                  {products?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-accent-orange/10 rounded-full">
                <Package className="w-6 h-6 text-accent-orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-light-gray mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "overview"
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-dark-blue/70 hover:text-dark-blue"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "users"
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-dark-blue/70 hover:text-dark-blue"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "categories"
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-dark-blue/70 hover:text-dark-blue"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "products"
                ? "text-accent-orange border-b-2 border-accent-orange"
                : "text-dark-blue/70 hover:text-dark-blue"
            }`}
          >
            Products
          </button>
        </div>

        {/* Users Section */}
        {(activeTab === "overview" || activeTab === "users") && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-light-gray min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark-blue flex items-center gap-2">
                <Users className="w-5 h-5" /> Users
              </h2>
              <span className="bg-light-gray text-dark-blue px-3 py-1 rounded-full text-sm">
                {filteredUsers.length} users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-gray">
                  <tr className="text-left">
                    <th className="p-3 font-medium text-dark-blue">Email</th>
                    <th className="p-3 font-medium text-dark-blue">Role</th>
                    <th className="p-3 font-medium text-dark-blue">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u, i) => (
                      <tr
                        key={i}
                        className="border-b border-light-gray hover:bg-accent-orange/5 transition"
                      >
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-accent-orange/20 text-accent-orange"
                                : "bg-dark-blue/10 text-dark-blue"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center p-6 text-dark-blue/50"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {(activeTab === "overview" || activeTab === "categories") && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-light-gray min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark-blue flex items-center gap-2">
                <FolderOpen className="w-5 h-5" /> Categories
              </h2>
              <button
                onClick={() => navigate("/category/create")}
                className="bg-accent-orange text-dark-blue px-4 py-2 rounded-lg font-medium hover:bg-accent-orange/90 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New 
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-gray">
                  <tr className="text-left">
                    <th className="p-3 font-medium text-dark-blue">Title</th>
                    <th className="p-3 font-medium text-dark-blue">
                      Created At
                    </th>
                    <th className="p-3 font-medium text-dark-blue">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-light-gray hover:bg-accent-orange/5 transition"
                      >
                        <td className="p-3 font-medium">{c.title}</td>
                        <td className="p-3 text-dark-blue/70">
                          {format(new Date(c.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Link
                              to={`/category/edit/${c._id}`}
                              className="p-2 rounded-lg bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            {c.title.toLowerCase() !== "others" && (
                              <button
                                onClick={() =>
                                  handleDelete(c._id, "category", c.title)
                                }
                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center p-6 text-dark-blue/50"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Section */}
        {(activeTab === "overview" || activeTab === "products") && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-light-gray min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark-blue flex items-center gap-2">
                <Package className="w-5 h-5" /> Products
              </h2>
              <button
                onClick={() => navigate("/product/create")}
                className="bg-accent-orange text-dark-blue px-4 py-2 rounded-lg font-medium hover:bg-accent-orange/90 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New 
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-gray">
                  <tr className="text-left">
                    <th className="p-3 font-medium text-dark-blue">Title</th>
                    <th className="p-3 font-medium text-dark-blue">Price</th>
                    <th className="p-3 font-medium text-dark-blue">Stock</th>
                    <th className="p-3 font-medium text-dark-blue">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-light-gray hover:bg-accent-orange/5 transition"
                      >
                        <td className="p-3 font-medium">{p.title}</td>
                        <td className="p-3 text-accent-orange font-semibold">
                          ${p.price}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Link
                              to={`/product/${p._id}`}
                              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-800 transition cursor-pointer"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/product/edit/${p._id}`}
                              className="p-2 rounded-lg bg-accent-orange/10 hover:bg-accent-orange/20 text-accent-orange transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(p._id, "product", p.title)
                              }
                              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition cursor-pointer"
                              title="Delete"
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
                        className="text-center p-6 text-dark-blue/50"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
