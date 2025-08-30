import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/Editor/Editor";
import { openModal } from "../../store/Modal/modalSlice";
import { useDispatch } from "react-redux";
import { addCategory } from "../../store/category/categorySlice";

const CategoryCreator = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        openModal({
          title: "Error",
          message: res.data.message || "Category creation failed",
          buttonText: "OK",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-dark-blue mb-6 text-center">
          Create new Category
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
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title}</span>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label htmlFor="image" className="text-dark-blue font-medium mb-1">
              Image
            </label>
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
              hover:file:bg-dark-blue hover:file:text-white`}
            />
            {errors.image && (
              <span className="text-red-500 text-sm mt-1">{errors.image}</span>
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
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-accent-orange text-dark-blue font-semibold py-2 rounded-lg shadow-md hover:bg-dark-blue hover:text-white transition-all duration-300 flex-1 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreator;