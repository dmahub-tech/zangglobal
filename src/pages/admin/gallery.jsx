import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaImage, FaEye } from "react-icons/fa";

const GalleryManagement = () => {
	const [galleryItems, setGalleryItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [currentItem, setCurrentItem] = useState({
		galleryId: "",
		title: "",
		description: "",
		category: "general",
		imageUrl: "",
		isActive: true,
	});
	const [imageFile, setImageFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [filter, setFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");

	const categories = ["technology", "sustainability", "events", "team", "projects", "general"];

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

	useEffect(() => {
		fetchGalleryItems();
	}, [categoryFilter]);

	const fetchGalleryItems = async () => {
		try {
			const params = {};
			if (categoryFilter) params.category = categoryFilter;
			
			const response = await axios.get(`${API_URL}/gallery`, { params });
			setGalleryItems(response.data.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching gallery items:", error);
			toast.error("Failed to fetch gallery items");
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			let imageUrl = currentItem.imageUrl;

			// Upload image if a new one is selected
			if (imageFile) {
				imageUrl = await uploadImage();
				if (!imageUrl) {
					setLoading(false);
					return;
				}
			}

			const itemData = {
				...currentItem,
				imageUrl,
			};

			if (editMode) {
				await axios.put(`${API_URL}/gallery/${currentItem.galleryId}`, itemData, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				});
				toast.success("Gallery item updated successfully");
			} else {
				await axios.post(`${API_URL}/gallery`, itemData, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				});
				toast.success("Gallery item created successfully");
			}

			setShowModal(false);
			resetForm();
			fetchGalleryItems();
		} catch (error) {
			console.error("Error saving gallery item:", error);
			toast.error("Failed to save gallery item");
		} finally {
			setLoading(false);
		}
	};

	const uploadImage = async () => {
		if (!imageFile) return null;

		setUploading(true);
		const formData = new FormData();
		formData.append("image", imageFile);

		try {
			const response = await axios.post(`${API_URL}/gallery/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
				},
			});
			setUploading(false);
			return response.data.data.imageUrl;
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Failed to upload image");
			setUploading(false);
			return null;
		}
	};

	const handleEdit = (item) => {
		setCurrentItem(item);
		setEditMode(true);
		setShowModal(true);
	};

	const handleDelete = async (galleryId) => {
		if (window.confirm("Are you sure you want to delete this gallery item?")) {
			try {
				await axios.delete(`${API_URL}/gallery/${galleryId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				});
				toast.success("Gallery item deleted successfully");
				fetchGalleryItems();
			} catch (error) {
				console.error("Error deleting gallery item:", error);
				toast.error("Failed to delete gallery item");
			}
		}
	};

	const resetForm = () => {
		setCurrentItem({
			galleryId: "",
			title: "",
			description: "",
			category: "general",
			imageUrl: "",
			isActive: true,
		});
		setImageFile(null);
		setEditMode(false);
	};

	const openModal = () => {
		resetForm();
		setShowModal(true);
	};

	const filteredItems = galleryItems.filter((item) =>
		item.title.toLowerCase().includes(filter.toLowerCase()) ||
		item.description?.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
				<button
					onClick={openModal}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
				>
					<FaPlus /> Add Gallery Item
				</button>
			</div>

			{/* Filters */}
			<div className="mb-6 flex gap-4">
				<input
					type="text"
					placeholder="Search gallery items..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
				/>
				<select
					value={categoryFilter}
					onChange={(e) => setCategoryFilter(e.target.value)}
					className="border border-gray-300 rounded-lg px-4 py-2"
				>
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category.charAt(0).toUpperCase() + category.slice(1)}
						</option>
					))}
				</select>
			</div>

			{/* Gallery Items Grid */}
			{loading ? (
				<div className="text-center py-8">Loading...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredItems.map((item) => (
						<div key={item.galleryId} className="bg-white rounded-lg shadow-md overflow-hidden">
							<div className="relative group">
								<img
									src={item.imageUrl}
									alt={item.title}
									className="w-full h-48 object-cover"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
									<button
										onClick={() => window.open(item.imageUrl, "_blank")}
										className="bg-white text-black p-2 rounded-full mx-1 hover:bg-gray-200"
									>
										<FaEye />
									</button>
								</div>
								<div className="absolute top-2 right-2">
									<span className={`px-2 py-1 text-xs font-semibold rounded ${
										item.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
									}`}>
										{item.isActive ? "Active" : "Inactive"}
									</span>
								</div>
							</div>
							<div className="p-4">
								<h3 className="font-bold text-lg mb-2">{item.title}</h3>
								<p className="text-gray-600 text-sm mb-2 line-clamp-2">
									{item.description}
								</p>
								<p className="text-xs text-gray-500 mb-3">
									Category: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
								</p>
								<div className="flex justify-between items-center">
									<span className="text-xs text-gray-400">
										{new Date(item.createdAt).toLocaleDateString()}
									</span>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(item)}
											className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
										>
											<FaEdit />
										</button>
										<button
											onClick={() => handleDelete(item.galleryId)}
											className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{filteredItems.length === 0 && !loading && (
				<div className="text-center py-8 text-gray-500">No gallery items found</div>
			)}

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-4">
							{editMode ? "Edit Gallery Item" : "Add Gallery Item"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Title *
								</label>
								<input
									type="text"
									value={currentItem.title}
									onChange={(e) =>
										setCurrentItem({ ...currentItem, title: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Description
								</label>
								<textarea
									value={currentItem.description}
									onChange={(e) =>
										setCurrentItem({ ...currentItem, description: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
									rows="3"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Category
								</label>
								<select
									value={currentItem.category}
									onChange={(e) =>
										setCurrentItem({ ...currentItem, category: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
								>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category.charAt(0).toUpperCase() + category.slice(1)}
										</option>
									))}
								</select>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Image
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setImageFile(e.target.files[0])}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
								/>
								{currentItem.imageUrl && (
									<img
										src={currentItem.imageUrl}
										alt="Current"
										className="mt-2 w-full h-32 object-cover rounded"
									/>
								)}
							</div>

							<div className="mb-4">
								<label className="flex items-center">
									<input
										type="checkbox"
										checked={currentItem.isActive}
										onChange={(e) =>
											setCurrentItem({ ...currentItem, isActive: e.target.checked })
										}
										className="mr-2"
									/>
									<span className="text-gray-700 text-sm font-bold">Active</span>
								</label>
							</div>

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={loading || uploading}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
								>
									{loading || uploading ? "Saving..." : editMode ? "Update" : "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default GalleryManagement;