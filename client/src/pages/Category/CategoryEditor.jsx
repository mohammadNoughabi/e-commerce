import { useState } from "react";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useModal from "../../hooks/useModal";

const CategoryEditor = ({ categoryToEdit }) => {
  const isEditMode = Boolean(categoryToEdit?.id);

  const [title, setTitle] = useState(categoryToEdit?.title || "");
  const [image, setImage] = useState(categoryToEdit?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState(
    categoryToEdit?.description || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!isEditMode && !imageFile) newErrors.image = "Image is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }
      setImage(file.name);
      setImageFile(file);
      setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    if (imageFile) formData.append("imageFile", imageFile);
    formData.append("description", description);

    try {
      const endpoint = isEditMode
        ? `/api/category/${categoryToEdit.id}`
        : "/api/category";


      const res = isEditMode
        ? await api.put(endpoint, formData)
        : await api.post(endpoint, formData);

      showModal({
        title: "Success",
        message:
          res.data.message ||
          `Category ${title} ${
            isEditMode ? "updated" : "created"
          } successfully.`,
        buttons: [
          {
            text: "OK",
            className: "primary-theme",
            onClick: () => navigate(isEditMode ? -1 : "/categories"),
          },
        ],
      });

      if (!isEditMode) {
        setTitle("");
        setImage("");
        setImageFile(null);
        setDescription("");
      }
    } catch (error) {
      console.error(error);
      showModal({
        title: "Error",
        message: error.response?.data?.message || "An error occurred",
        buttons: [{ text: "OK", className: "error-theme" }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-dark-blue mb-6 text-center">
          {isEditMode ? "Edit Category" : "Create New Category"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-dark-blue font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              placeholder="Enter category title"
              onChange={(e) => setTitle(e.target.value)}
              className={`border ${
                errors.title ? "border-red-500" : "border-light-gray"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-orange`}
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* Image File */}
          <div className="flex flex-col">
            <label htmlFor="image" className="text-dark-blue font-medium mb-1">
              {isEditMode ? "Update Image" : "Image *"}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className={`border ${
                errors.image ? "border-red-500" : "border-light-gray"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-orange file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-accent-orange file:text-dark-blue file:font-medium hover:file:bg-dark-blue hover:file:text-white`}
            />
            {image && (
              <span className="text-sm text-dark-blue mt-1">
                {isEditMode && !imageFile ? "Current: " : "Selected: "}
                {image}
              </span>
            )}
            {errors.image && (
              <span className="text-red-500 text-sm mt-1">{errors.image}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-dark-blue font-medium mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`border ${
                errors.description ? "border-red-500" : "border-light-gray"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-orange`}
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description}
              </span>
            )}
          </div>

          {/* Submit button */}
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent-orange text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-dark-blue hover:text-white transition-all duration-300 flex-1 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isEditMode ? "Update Category" : "Create Category"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 flex-1"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditor;
