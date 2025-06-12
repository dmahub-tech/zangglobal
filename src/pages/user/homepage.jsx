import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash-es';

// Lazy load heavy components
const CartItems = lazy(() => import('../../components/user/cart/Cartitems'));
const ProductCard = lazy(() => import('../../components/user/ProductCard'));

// API functions should be imported dynamically when needed
let fetchProducts;

// Optimized carousel slides with preloaded and sized images
const carouselSlides = [
  {
    title: "50% OFF Summer Sale",
    description: "Limited time offers on curated gift selections",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&auto=format&fit=crop",
    cta: "Shop Now",
    ctaLink: "/summer-sale"
  },
  {
    title: "New Arrivals",
    description: "Discover our latest collection of thoughtful gifts",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=600&auto=format&fit=crop",
    cta: "Explore New Items",
    ctaLink: "/new-arrivals"
  },
  {
    title: "Premium Collection",
    description: "Elevate your gifting with our luxury selections",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&auto=format&fit=crop",
    cta: "View Collection",
    ctaLink: "/premium"
  }
];

// Preload first carousel image
const preloadImage = (url) => {
  const img = new Image();
  img.src = url;
};
preloadImage(carouselSlides[0].image);

// Simplified Carousel with optimized animations
const Carousel = React.memo(({ slides, currentSlide }) => {
  return (
    <div className="relative w-full overflow-hidden aspect-[2/1]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex items-center">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl text-white"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-lg sm:text-xl mb-6 opacity-90">
                  {slides[currentSlide].description}
                </p>
                <Link
                  to={slides[currentSlide].ctaLink}
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-all duration-300 group"
                  prefetch="intent"
                >
                  {slides[currentSlide].cta}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

// Optimized Scroll Progress
const ScrollProgress = React.memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress(Math.min((currentScroll / scrollHeight) * 100, 100));
      }
    };

    const debouncedScroll = debounce(updateScrollProgress, 16);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
      style={{ width: `${scrollProgress}%` }}
    />
  );
});

// Optimized Cart Overlay
const CartOverlay = React.memo(({ onClose }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', ease: 'easeInOut' }}
      className="fixed inset-0 w-full h-full bg-white shadow-2xl z-50 sm:w-96 sm:left-auto sm:right-0"
    >
      <div className="relative h-full flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full transition-colors"
          aria-label="Close cart"
        >
          <FiX className="h-5 w-5" />
        </button>
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-xl font-semibold flex items-center">
            <FiShoppingCart className="mr-2" />
            Your Cart
          </h3>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Suspense fallback={<div className="text-center py-8">Loading cart...</div>}>
            <CartItems />
          </Suspense>
        </div>
        <div className="border-t border-gray-200 p-4">
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </motion.div>
  );
});

// Optimized Product Grid
const ProductGrid = React.memo(({ title, products, showCategories = true }) => {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const handleClose = useCallback(() => setVisible(false), []);

  const categories = useMemo(() => [
    { name: "All", id: "all" },
    { name: "Popular", id: "popular" },
    { name: "New Arrivals", id: "new" },
    { name: "Best Sellers", id: "bestsellers" },
    { name: "Special Offers", id: "offers" }
  ], []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'all') return products.slice(0, 12);
    return products.slice(0, 8);
  }, [products, activeCategory]);

  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <AnimatePresence>
        {visible && <CartOverlay onClose={handleClose} />}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {showCategories && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium group"
          prefetch="intent"
        >
          View all
          <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <Suspense key={index} fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
              <ProductCard product={product} />
            </Suspense>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category</p>
        </div>
      )}
    </section>
  );
});

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Auto-advancing carousel with optimized timing
  useEffect(() => {
    let interval;
    const carouselElement = document.getElementById('carousel');
    
    const startInterval = () => {
      interval = setInterval(() => {
        setCurrentSlide(prev => {
          const nextSlide = (prev + 1) % carouselSlides.length;
          // Preload next image
          preloadImage(carouselSlides[nextSlide].image);
          return nextSlide;
        });
      }, 6000);
    };
    
    const pauseInterval = () => clearInterval(interval);
    
    startInterval();
    
    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', pauseInterval);
      carouselElement.addEventListener('mouseleave', startInterval);
    }
    
    return () => {
      clearInterval(interval);
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', pauseInterval);
        carouselElement.removeEventListener('mouseleave', startInterval);
      }
    };
  }, []);

  // Optimized product fetching with caching
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        // Check session storage for cached products
        const cachedProducts = sessionStorage.getItem('cachedProducts');
        if (cachedProducts) {
          const data = JSON.parse(cachedProducts);
          if (isMounted) {
            setProducts(data);
            dispatch(getProducts(data));
            setLoading(false);
          }
          return;
        }

        // Dynamically import API function when needed
        if (!fetchProducts) {
          fetchProducts = (await import('../../config/api')).fetchProducts;
        }

        const { data } = await fetchProducts({ signal: controller.signal });
        if (isMounted) {
          setProducts(data);
          dispatch(getProducts(data));
          // Cache the response
          sessionStorage.setItem('cachedProducts', JSON.stringify(data));
          setLoading(false);
        }
      } catch (error) {
        if (isMounted && error.name !== 'AbortError') {
          console.error("Error fetching products:", error);
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dispatch]);

  if (loading || !products) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading beautiful gifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollProgress />
      
      <main className="pb-12">
        <div id="carousel">
          <Carousel slides={carouselSlides} currentSlide={currentSlide} />
        </div>
        
        <ProductGrid 
          title="Our Curated Collection" 
          products={products} 
          showCategories={true}
        />
      </main>
    </div>
  );
};

export default React.memo(HomePage);