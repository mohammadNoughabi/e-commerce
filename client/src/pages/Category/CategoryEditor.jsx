import api from "../../api/api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../store/Modal/modalSlice";
import Editor from "../../components/Editor/Editor";

const CategoryEditor = () => {
  let apiBase = import.meta.env.VITE_API_BASE;
  let { id } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setIsLoading(true);
        let response = await api.get(`/api/category/${id}`);
        const categoryData = response.data.category;
        setCategory(categoryData);
        setTitle(categoryData.title);
        setDescription(categoryData.description);

        const imageUrl = `${apiBase}/uploads/categories/${categoryData.title}/${categoryData.image}`;
        setImagePreview(imageUrl);
      } catch (error) {
        console.log(error);
        setCategory(null);
        dispatch(
          openModal({
            title: "Error",
            message: "Failed to fetch category details",
            buttonText: "OK",
          })
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id, dispatch]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!imagePreview) newErrors.image = "Image is required";
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
      setImageFile(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      let response = await api.put(`/api/category/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        dispatch(
          openModal({
            title: "Success",
            message: response.data.message || "Category updated successfully",
            buttonText: "OK",
            onClose: () => navigate("/categories"),
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        openModal({
          title: "Error",
          message: error.response?.data?.message || "Category update failed",
          buttonText: "OK",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading && !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-dark-blue text-lg">
          Loading category details...
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="text-dark-blue text-lg">Category not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-dark-blue mb-6 text-center">
          Update Category: {category.title}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title Field */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-dark-blue font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`border ${
                errors.title ? "border-red-500" : "border-light-gray"
              } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-orange`}
              placeholder="Enter category title"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-dark-blue font-medium mb-2"
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

          {/* Image Field */}
          <div className="flex flex-col">
            <label htmlFor="image" className="text-dark-blue font-medium mb-2">
              Image *
            </label>

            {/* Show current image preview */}
            {imagePreview && (
              <div className="mb-4">
                <p className="text-dark-blue font-medium mb-2">
                  Image Preview:
                </p>
                <div className="border border-light-gray rounded-lg p-2 flex justify-center bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="max-h-64 object-contain rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {imageFile
                    ? "New image will replace the current one when you submit"
                    : "Current category image"}
                </p>
              </div>
            )}

            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`border ${
                errors.image ? "border-red-500" : "border-light-gray"
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-orange 
                file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 
                file:bg-accent-orange file:text-dark-blue file:font-medium 
                hover:file:bg-dark-blue hover:file:text-white`}
            />
            {errors.image && (
              <span className="text-red-500 text-sm mt-1">{errors.image}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-200 text-dark-blue font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300 flex-1 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent-orange text-dark-blue font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-dark-blue hover:text-white transition-all duration-300 flex-1 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-dark-blue"
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
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditor;
