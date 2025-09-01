import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/Editor/Editor";
import { openModal } from "../../store/Modal/modalSlice";
import { useDispatch } from "react-redux";
import { addCategory } from "../../store/category/categorySlice";
import { Helmet } from "react-helmet";

const CategoryCreator = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setImage(null);
    setImagePreview(null);
    setDescription("");
    setErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!image) newErrors.image = "Image is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      
      setImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setErrors({ ...errors, image: null });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const endpoint = "/api/category";

      const res = await api.post(endpoint, formData);

      if (res.status === 200) {
        dispatch(addCategory(res.data.newCategory));
        dispatch(
          openModal({
            title: "Success",
            message: res.data.message || "Category created successfully",
            buttonText: "OK",
            onClose: () => {
              resetForm(); // Reset form after successful submission
              navigate("/categories"); // Redirect to categories page
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        openModal({
          title: "Error",
          message: error.response?.data?.message || "Category creation failed. Please try again.",
          buttonText: "OK",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray p-4 md:p-6">
      <Helmet>
        <title>Create New Category | Your Site Name</title>
        <meta name="description" content="Create a new category to organize your content effectively." />
        <meta name="keywords" content="category, create, content organization" />
        <meta property="og:title" content="Create New Category | Your Site Name" />
        <meta property="og:description" content="Create a new category to organize your content effectively." />
      </Helmet>
      
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-dark-blue mb-6 text-center">
          Create New Category
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
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
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <span id="title-error" className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label htmlFor="image" className="text-dark-blue font-medium mb-1">
              Image *
            </label>
            <div className="relative">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className={`border ${
                  errors.image ? "border-red-500" : "border-light-gray"
                } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-orange 
                file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 
                file:bg-accent-orange file:text-dark-blue file:font-medium 
                hover:file:bg-dark-blue hover:file:text-white w-full`}
                aria-describedby={errors.image ? "image-error" : undefined}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
            {errors.image && (
              <span id="image-error" className="text-red-500 text-sm mt-1">{errors.image}</span>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-dark-blue font-medium mb-2">Image Preview:</p>
                <div className="border border-light-gray rounded-lg p-2 flex justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 object-contain rounded-lg"
                  />
                </div>
              </div>
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
            <Editor value={description} onChange={setDescription} />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2 flex-col sm:flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent-orange text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-dark-blue hover:text-white transition-all duration-300 flex-1 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : "Create Category"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 flex-1"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreator;