import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Users,
  LayoutDashboard,
  LogOut,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Newspaper,
  Menu,
  ChevronLeft,
  Plus,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/slice/productSlice";
import { toast } from "react-toastify";
import { useAdminAuth } from "../context/Admin";

const AdminLayout = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    img: [],
    category: "",
    description: "",
    inStockValue: 0,
    visibility: true,
  });
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: `/admin/dashboard`,
    },
    {
      name: "Products",
      icon: <Package className="w-5 h-5" />,
      path: `/admin/products/`,
    },
    {
      name: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: `/admin/orders/`,
    },
    {
      name: "Customers",
      icon: <Users className="w-5 h-5" />,
      path: `/admin/customers/`,
    },
    {
      name: "Reviews",
      icon: <MessageSquare className="w-5 h-5" />,
      path: `/admin/reviews/`,
    },
    {
      name: "Blogs",
      icon: <Newspaper className="w-5 h-5" />,
      path: `/admin/blogs/`,
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: `/admin/settings/`,
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setSelectedFile(files);
    setProductData((prevData) => ({
      ...prevData,
      img: files,
    }));
  };

  const removeImage = (index) => {
    setSelectedFile((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const response = await dispatch(createProduct(productData));

      if (response.meta.requestStatus === "fulfilled") {
        toast.success(`Product "${productData.name}" created successfully`);
        resetForm();
        setShowDialog(false);
      } else {
        toast.error(`Error creating product: ${response.payload}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(`Error creating product: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      price: "",
      img: [],
      category: "",
      description: "",
      inStockValue: 0,
    });
    setSelectedFile([]);
  };

  const { admin, logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 p-4 flex items-center justify-between">
        <button onClick={toggleSidebar} className="text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-xl font-bold text-gray-800">Admin Panel</div>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="text-xl font-bold">Zang Global</div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700 space-y-3">
            <button
              onClick={() => setShowDialog(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>View Store</span>
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>

            <div className="text-center text-gray-400 text-xs pt-4">
              Zang Global Admin © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "lg:ml-64" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        {/* Product Creation Modal */}
        {showDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Product
                </h2>
                <button
                  onClick={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="space-y-4">
                    <label className="block cursor-pointer">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 text-center">
                          {selectedFile.length > 0
                            ? `${selectedFile.length} image(s) selected`
                            : "Click to browse or drag & drop images"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended size: 800x800px
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>

                    {/* Image Previews */}
                    {selectedFile.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedFile.map((file, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Premium USB Cable"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      name="category"
                      value={productData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="USB Cable">USB Cables</option>
                      <option value="Solar Lantern">Solar Lantern</option>
                      <option value="Power Bank">Power Bank</option>
                      <option value="Mobile Chargers">Mobile Chargers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity*
                    </label>
                    <input
                      type="number"
                      name="inStockValue"
                      value={productData.inStockValue}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Available quantity"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed product description..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDialog(false);
                      resetForm();
                    }}
                    className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !productData.name || !productData.price || !productData.category || selectedFile.length === 0}
                    className={`px-5 py-2.5 rounded-lg flex items-center gap-2 ${
                      isUploading || !productData.name || !productData.price || !productData.category || selectedFile.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                    {isUploading ? "Creating..." : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;