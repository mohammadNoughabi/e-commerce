import { useState } from "react";
import { FaUser, FaList, FaBox, FaBlog, FaEnvelope, FaPlus, FaEye, FaEdit } from "react-icons/fa";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  

  const tabs = [
    { key: "users", label: "Users", icon: <FaUser /> },
    { key: "categories", label: "Categories", icon: <FaList /> },
    { key: "products", label: "Products", icon: <FaBox /> },
    { key: "blogs", label: "Blogs", icon: <FaBlog /> },
    { key: "messages", label: "Messages", icon: <FaEnvelope /> },
  ];

  
}
