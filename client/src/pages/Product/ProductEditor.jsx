import api from "../../api/api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../../components/Editor/Editor";
import { openModal } from "../../store/Modal/modalSlice";

const ProductEditor = () => {
  let { id } = useParams();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let apiBase = import.meta.env.VITE_API_BASE;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!price || price <= 0) newErrors.price = "Valid price is required";
    if (Number(stock) < 0) newErrors.stock = "Stock can not be less than 0";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!image && !imagePreview) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/category");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  const fetchProduct = async () => {
    try {
      let response = await api.get(`/api/product/${id}`);
      if (response.status === 200) {
        const productData = response.data.product;
        setProduct(productData);
        setTitle(productData.title);
        setDescription(productData.description);
        setPrice(productData.price);
        setStock(productData.stock);
        setCategoryId(productData.categoryId || "");
        setImagePreview(productData.image || "");
        setGalleryPreviews(productData.gallery || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const invalidFile = files.find((f) => !f.type.startsWith("image/"));
    if (invalidFile) {
      setErrors({ ...errors, gallery: "All gallery files must be images" });
      return;
    }

    // Create previews for new files
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setGallery([...gallery, ...files]);
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    setErrors({ ...errors, gallery: null });
  };

  const removeGalleryImage = (index) => {
    const updatedGallery = [...gallery];
    const updatedPreviews = [...galleryPreviews];

    // Revoke object URL if it's a new file
    if (updatedPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }

    updatedGallery.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setGallery(updatedGallery);
    setGalleryPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (categoryId) {
      formData.append("categoryId", categoryId);
    }
    if (image) {
      formData.append("image", image);
    }

    gallery.forEach((file, index) => {
      formData.append("gallery", file);
    });

    try {
      let response = await api.put(`/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(
        openModal({
          title: "Success",
          message: response.data.message || "Product updated successfully",
          buttonText: "OK",
        })
      );
      navigate(-1);
    } catch (error) {
      dispatch(
        openModal({
          title: "Error",
          message: error.response?.data?.message || "Failed to update product",
          buttonText: "Try Again",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-dark-blue mb-8 pb-2 border-b border-gray-200">Edit Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Field */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            htmlFor="title"
            className="block text-base font-semibold text-dark-blue mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition-colors ${
              errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter product title"
          />
          {errors.title && (
            <p className="mt-2 text-red-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            htmlFor="description"
            className="block text-base font-semibold text-dark-blue mb-2"
          >
            Description *
          </label>
          <Editor value={description} onChange={setDescription} />
          {errors.description && (
            <p className="mt-2 text-red-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.description}
            </p>
          )}
        </div>

        {/* Price and Stock Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <label
              htmlFor="price"
              className="block text-base font-semibold text-dark-blue mb-2"
            >
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition-colors ${
                  errors.price ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-red-600 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.price}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <label
              htmlFor="stock"
              className="block text-base font-semibold text-dark-blue mb-2"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition-colors ${
                errors.stock ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              min="0"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-2 text-red-600 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.stock}
              </p>
            )}
          </div>
        </div>

        {/* Category Field */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            htmlFor="category"
            className="block text-base font-semibold text-dark-blue mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange bg-white"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Main Image Field */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            htmlFor="image"
            className="block text-base font-semibold text-dark-blue mb-2"
          >
            Main Image *
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="image" className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload main product image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
          {errors.image && (
            <p className="mt-2 text-red-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.image}
            </p>
          )}

          {imagePreview && (
            <div className="mt-6">
              <p className="text-sm font-medium text-dark-blue mb-3">Image Preview:</p>
              <div className="relative inline-block group">
                <img
                  src={imagePreview.startsWith("blob:") ? imagePreview : `${apiBase}/uploads/products/${product.title}/${imagePreview}`}
                  alt="Main image preview"
                  className="h-48 w-48 object-cover rounded-lg border-2 border-gray-300 shadow-sm group-hover:opacity-90 transition-opacity"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 -mt-2 -mr-2 shadow-md hover:bg-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Images Field */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label
            htmlFor="gallery"
            className="block text-base font-semibold text-dark-blue mb-2"
          >
            Gallery Images
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.gallery ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
            <input
              type="file"
              id="gallery"
              onChange={handleGalleryChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <label htmlFor="gallery" className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload multiple gallery images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
            </label>
          </div>
          {errors.gallery && (
            <p className="mt-2 text-red-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.gallery}
            </p>
          )}

          {galleryPreviews.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-dark-blue mb-3">Gallery Previews:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.startsWith("blob:") ? preview : `${apiBase}/uploads/products/${product.title}/${preview}`}
                      alt={`Gallery preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-lg border border-gray-300 shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-dark-blue text-dark-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-accent-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditor;