import { useEffect, useState } from "react";
import Editor from "../../components/Editor/Editor";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import { openModal } from "../../store/Modal/modalSlice";
import { addProduct } from "../../store/product/productSlice";

const ProductCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock , setStock] = useState(null);
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [categoryId, setCategoryId] = useState("");
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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!image) newErrors.image = "Image is required";
    if (!price) newErrors.price = "Price is required";
    if (Number(stock) < 0) newErrors.stock = "Stock can not be less than 0"
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock" , stock);
    formData.append("image", image);
    if (categoryId) formData.append("categoryId", categoryId);

    gallery.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const res = await api.post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(addProduct(res.data.newProduct));
      dispatch(openModal({ message: "Product created successfully!" }));

      setTitle("");
      setDescription("");
      setPrice("");
      setStock(null);
      setImage(null);
      setGallery([]);
      setCategoryId("");
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
    setGallery(files);
    setErrors({ ...errors, gallery: null });
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
            placeholder="Ex. Shoe"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">
            Description
          </label>
          <Editor value={description} onChange={setDescription} />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Price</label>
          <input
            type="text"
            placeholder="Ex. 1200$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>

        {/* stock */}
         <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Stock</label>
          <input
            type="text"
            placeholder="Ex. 500"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-dark-blue rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent-orange"
          />
          {errors.price && <p className="text-red-500">{errors.stock}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-1 text-dark-blue font-semibold">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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
            </div>
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </label>

          {/* ✅ Preview for single image */}
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
            </div>
            {errors.gallery && <p className="text-red-500">{errors.gallery}</p>}
          </label>

          {/* ✅ Previews for gallery */}
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
                    onClick={() =>
                      setGallery((prev) => prev.filter((_, i) => i !== index))
                    }
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
