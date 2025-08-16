import { useEffect, useState } from "react";
import {
  FaUser,
  FaList,
  FaBox,
  FaBlog,
  FaEnvelope,
  FaPlus,
  FaEye,
  FaEdit,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { setUsers } from "../../store/user/userSlice";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userRole } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  const { blogs } = useSelector((state) => state.blog);
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const tabs = [
    { key: "users", label: "Users", icon: <FaUser /> },
    { key: "categories", label: "Categories", icon: <FaList /> },
    { key: "products", label: "Products", icon: <FaBox /> },
    { key: "blogs", label: "Blogs", icon: <FaBlog /> },
    { key: "messages", label: "Messages", icon: <FaEnvelope /> },
  ];

  const fetchUsers = async () => {
    try {
      let response = await api.get("/api/user");
      if (response.status === 200) {
        dispatch(setUsers(response.data.users));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  if (userRole !== "admin") {
    return (
      <h2 className="text-center text-red-600 text-xl mt-10">Access denied</h2>
    );
  }

  const renderTable = (items, type) => {
    let headers = [];
    let rowMapper;

    switch (type) {
      case "users":
        headers = ["#", "Email", "Role", "Login Status", "Actions"];
        rowMapper = (item, idx) => [
          idx + 1,
          item.email,
          item.role,
          item.loginStatus,
        ];
        break;
      case "blogs":
        headers = ["#", "Title", "Created At", "Updated At", "Actions"];
        rowMapper = (item, idx) => [
          idx + 1,
          item.title,
          item.createdAt,
          item.updatedAt,
        ];
        break;
      case "categories":
        headers = ["#", "Title", "Created At", "Updated At", "Actions"];
        rowMapper = (item, idx) => [
          idx + 1,
          item.title,
          item.createdAt,
          item.updatedAt,
        ];
        break;
      case "products":
        headers = [
          "#",
          "Title",
          "Price",
          "Stock",
          "Created At",
          "Updated At",
          "Actions",
        ];
        rowMapper = (item, idx) => [
          idx + 1,
          item.title,
          item.price,
          item.stock,
          item.createdAt,
          item.updatedAt,
        ];
        break;
      default:
        headers = ["#", "Name", "Actions"];
        rowMapper = (item, idx) => [idx + 1, item.name || item.title];
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-auto max-w-full">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-dark-blue text-white">
            <tr>
              {headers.map((head, i) => (
                <th key={i} className="p-3 whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items?.length > 0 ? (
              items.map((item, idx) => {
                const rowValues = rowMapper(item, idx);
                return (
                  <tr
                    key={item._id || item.id}
                    className="border-b hover:bg-light-gray"
                  >
                    {rowValues.map((val, i) => (
                      <td key={i} className="p-3 whitespace-nowrap">
                        {val}
                      </td>
                    ))}
                    <td className="p-3 flex gap-2 whitespace-nowrap">
                      <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent-orange text-dark-blue cursor-pointer hover:bg-dark-blue hover:text-white transition">
                        <FaEye /> Show
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-dark-blue cursor-pointer text-white hover:bg-accent-orange hover:text-dark-blue transition">
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="p-3 text-center text-gray-500"
                >
                  No {type} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case "users":
        return renderTable(users, "users");
      case "categories":
        return renderTable(categories, "categories");
      case "products":
        return renderTable(products, "products");
      case "blogs":
        return renderTable(blogs, "blogs");
      case "messages":
        return renderTable([], "messages");
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-light-gray">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-dark-blue text-white flex flex-col p-4 transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          {isSidebarOpen && (
            <h1 className="text-2xl font-bold text-accent-orange">Admin</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`text-accent-orange hover:text-white cursor-pointer ${
              !isSidebarOpen ? "mx-auto" : ""
            }`}
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-left transition cursor-pointer
                ${
                  activeTab === tab.key
                    ? "bg-accent-orange text-dark-blue"
                    : "hover:bg-light-gray hover:text-dark-blue"
                }`}
            >
              {tab.icon}
              {isSidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize text-dark-blue">
            {activeTab}
          </h2>
          <button className="flex items-center gap-2 bg-accent-orange text-dark-blue px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-dark-blue hover:text-white transition">
            <FaPlus /> Create New
          </button>
        </div>
        {getActiveItems()}
      </main>
    </div>
  );
}
