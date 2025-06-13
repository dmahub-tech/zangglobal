import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import initiatives from '../../initiatives';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const InitiativeDetail = () => {
  const { id } = useParams();
  const [initiative, setInitiative] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitiative = () => {
      setIsLoading(true);
      // Simulate loading delay for demo purposes
      setTimeout(() => {
        const initiativeData = initiatives.find(item => item.id === parseInt(id));
        setInitiative(initiativeData);
        setIsLoading(false);
      }, 800);
    };

    fetchInitiative();
  }, [id]);

  const openImageModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImages = (direction) => {
    if (!initiative?.images) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentImageIndex - 1 + initiative.images.length) % initiative.images.length;
    } else {
      newIndex = (currentImageIndex + 1) % initiative.images.length;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(initiative.images[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading initiative details...</p>
        </div>
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="text-center">
          <p className="text-xl text-gray-600">Initiative not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden my-8"
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/3">
          <motion.img
            className="w-full h-64 md:h-full object-cover"
            src={initiative.thumbnail}
            alt={initiative.title}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="p-8 md:w-2/3">
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {initiative.title}
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {initiative.content}
          </motion.p>
        </div>
      </div>

      {initiative.images && initiative.images.length > 0 && (
        <div className="px-8 pb-8">
          <motion.h2 
            className="text-xl font-semibold text-gray-800 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Gallery
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiative.images.map((image, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden cursor-pointer relative group"
                whileHover={{ scale: 1.03 }}
                onClick={() => openImageModal(image, index)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1,duration:0.3 }}
              >
                <img
                  src={image}
                  alt={`${initiative.title} - ${index + 1}`}
                  className="w-full h-48 md:h-56 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors"
            >
              <FiX />
            </button>

            <div className="relative max-w-4xl w-full">
              <motion.img
                key={currentImageIndex}
                src={selectedImage}
                alt={`${initiative.title} - ${currentImageIndex + 1}`}
                className="max-h-[80vh] w-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {initiative.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImages('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => navigateImages('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FiChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    {currentImageIndex + 1} / {initiative.images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InitiativeDetail;