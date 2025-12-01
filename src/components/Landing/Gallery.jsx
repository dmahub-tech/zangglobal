import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GalleryHorizontal, Loader } from "lucide-react";
import { GrGallery } from "react-icons/gr";
const GalleryComponent = () => {
	const [galleryItems, setGalleryItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [categories, setCategories] = useState([]);

	const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

	useEffect(() => {
		fetchGalleryItems();
		fetchCategories();
	}, []);

	useEffect(() => {
		filterItems();
	}, [selectedCategory, galleryItems]);

	const fetchGalleryItems = async () => {
		try {
			const response = await axios.get(`${API_URL}/gallery?isActive=true`);
			setGalleryItems(response.data.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching gallery items:", error);
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get(`${API_URL}/gallery/categories`);
			setCategories(["all", ...response.data.data]);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const filterItems = () => {
		if (selectedCategory === "all") {
			setFilteredItems(galleryItems);
		} else {
			setFilteredItems(galleryItems.filter(item => item.category === selectedCategory));
		}
	};

	const openImageModal = (image, index) => {
		setSelectedImage(image);
		setCurrentImageIndex(index);
		document.body.style.overflow = "hidden";
	};

	const closeImageModal = () => {
		setSelectedImage(null);
		setCurrentImageIndex(0);
		document.body.style.overflow = "unset";
	};

	const navigateImage = (direction) => {
		const currentFilteredItems = filteredItems;
		if (direction === "next") {
			const nextIndex = (currentImageIndex + 1) % currentFilteredItems.length;
			setCurrentImageIndex(nextIndex);
			setSelectedImage(currentFilteredItems[nextIndex]);
		} else {
			const prevIndex = currentImageIndex === 0 ? currentFilteredItems.length - 1 : currentImageIndex - 1;
			setCurrentImageIndex(prevIndex);
			setSelectedImage(currentFilteredItems[prevIndex]);
		}
	};

	const handleKeyDown = (e) => {
		if (selectedImage) {
			if (e.key === "Escape") {
				closeImageModal();
			} else if (e.key === "ArrowRight") {
				navigateImage("next");
			} else if (e.key === "ArrowLeft") {
				navigateImage("prev");
			}
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedImage, currentImageIndex]);

	if (loading) {
		return (
			<div className="py-16 px-4 text-center">
				<Loader />
			</div>
		);
	}

	return (
		<section className="py-16 h-screen px-4 bg-gray-50">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-800 mb-4">Our Gallery</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Explore our journey through images showcasing our impact, events, and the innovative work we do in assistive technology and sustainability.
					</p>
				</div>

				{/* Category Filter */}
				<div className="flex flex-wrap justify-center gap-4 mb-8">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setSelectedCategory(category)}
							className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
								selectedCategory === category
									? "bg-blue-500 text-white shadow-lg"
									: "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
							}`}
						>
							{category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
						</button>
					))}
				</div>

				{/* Gallery Grid */}
				{filteredItems.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{filteredItems.map((item, index) => (
							<div
								key={item.galleryId}
								className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
								onClick={() => openImageModal(item, index)}
							>
								<div className="aspect-w-16 aspect-h-12 overflow-hidden">
									<img
										src={item.imageUrl}
										alt={item.title}
										className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
									/>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="absolute bottom-4 left-4 right-4 text-white">
										<h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
										{item.description && (
											<p className="text-xs opacity-90 line-clamp-2">{item.description}</p>
										)}
									</div>
								</div>
								<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16  items-center justify-center flex flex-col">
						<div className="text-gray-400 text-6xl mb-4"><GrGallery /></div>
						<h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
						<p className="text-gray-500">
							{selectedCategory === "all" 
								? "No gallery items are currently available." 
								: `No images found in the "${selectedCategory}" category.`
							}
						</p>
					</div>
				)}

				{/* Image Modal */}
				{selectedImage && (
					<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
						<div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
							{/* Close Button */}
							<button
								onClick={closeImageModal}
								className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
							>
								<FaTimes size={20} />
							</button>

							{/* Navigation Buttons */}
							{filteredItems.length > 1 && (
								<>
									<button
										onClick={() => navigateImage("prev")}
										className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
									>
										<FaChevronLeft size={20} />
									</button>
									<button
										onClick={() => navigateImage("next")}
										className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
									>
										<FaChevronRight size={20} />
									</button>
								</>
							)}

							{/* Image */}
							<div className="relative w-full h-full flex items-center justify-center">
								<img
									src={selectedImage.imageUrl}
									alt={selectedImage.title}
									className="max-w-full max-h-full object-contain"
								/>
							</div>

							{/* Image Info */}
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
								<div className="max-w-4xl mx-auto">
									<h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
									{selectedImage.description && (
										<p className="text-gray-200 mb-2">{selectedImage.description}</p>
									)}
									<div className="flex items-center gap-4 text-sm text-gray-300">
										<span className="capitalize">Category: {selectedImage.category}</span>
										<span>•</span>
										<span>{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
										{filteredItems.length > 1 && (
											<>
												<span>•</span>
												<span>{currentImageIndex + 1} of {filteredItems.length}</span>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default GalleryComponent;