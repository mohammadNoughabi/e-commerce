import { useEffect, useState } from "react";
import Editor from "../../components/Editor/Editor";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import { openModal } from "../../store/Modal/modalSlice";
import { addProduct } from "../../store/product/productSlice";

const ProductCreator = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: ""
  });
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/category");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!image) newErrors.image = "Image is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (Number(formData.stock) < 0) newErrors.stock = "Stock can not be less than 0";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      categoryId: ""
    });
    setImage(null);
    setGallery([]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);
    submitData.append("image", image);
    if (formData.categoryId) submitData.append("categoryId", formData.categoryId);

    gallery.forEach((file) => {
      submitData.append("gallery", file);
    });

    try {
      const res = await api.post("/api/product", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addProduct(res.data.newProduct));
      dispatch(openModal({ message: "Product created successfully!" }));
      
      // Reset form and reload the page after a short delay
      resetForm();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error creating product", err);
      dispatch(openModal({ message: "Failed to create product" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please upload an image file" });
        return;
      }
      setImage(file);
      setErrors({ ...errors, image: "" });
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const invalidFile = files.find((f) => !f.type.startsWith("image/"));
    if (invalidFile) {
      setErrors({ ...errors, gallery: "All gallery files must be images" });
      return;
    }
    setGallery(files);
    setErrors({ ...errors, gallery: "" });
  };

  const removeGalleryImage = (index) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-light-gray rounded-xl shadow-md pt-3 mt-5">
      <h2 className="text-2xl font-bold mb-6 text-dark-blue">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Ex. Shoe"
            value={formData.title}
            onChange={handleInputChange}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">
            Description
          </label>
          <Editor 
            value={formData.description} 
            onChange={(value) => setFormData(prev => ({...prev, description: value}))} 
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Ex. 1200"
            value={formData.price}
            onChange={handleInputChange}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Ex. 500"
            value={formData.stock}
            onChange={handleInputChange}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          >
            <option value="">-- Select category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="flex flex-col">
          <label className="flex flex-col">
            <span className="mb-1 text-dark-blue font-semibold">Image</span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="image"
                className="cursor-pointer bg-dark-blue text-accent-orange font-semibold
          px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white"
              >
                Choose File
              </label>
              <input
                id="image"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              {image && <span className="text-sm text-dark-blue">{image.name}</span>}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </label>

          {/* Preview for single image */}
          {image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="flex flex-col">
          <label className="flex flex-col">
            <span className="mb-1 text-dark-blue font-semibold">Gallery</span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="gallery"
                className="cursor-pointer bg-dark-blue text-accent-orange font-semibold
          px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white"
              >
                Choose Files
              </label>
              <input
                id="gallery"
                type="file"
                multiple
                className="hidden"
                onChange={handleGalleryChange}
              />
              {gallery.length > 0 && <span className="text-sm text-dark-blue">{gallery.length} files selected</span>}
            </div>
            {errors.gallery && <p className="text-red-500 text-sm mt-1">{errors.gallery}</p>}
          </label>

          {/* Previews for gallery */}
          {gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((file, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Gallery ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full cursor-pointer bg-accent-orange text-dark-blue font-bold py-3 px-6 rounded-lg hover:bg-dark-blue hover:text-white transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductCreator;