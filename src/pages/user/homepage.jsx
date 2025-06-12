import React, { useState, useEffect, useMemo } from 'react';
import CartItems from "../../components/user/cart/Cartitems";
import { fetchProducts } from '../../config/api';
import ProductCard from '../../components/user/ProductCard';
import { useDispatch } from 'react-redux';
import { getProducts } from '../../redux/slice/productSlice';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px',
        backgroundColor: '#2e3192',
        transition: 'width 0.3s ease-out',
        zIndex: 1000,
      }}
    />
  );
};

const Carousel = ({ slides, currentSlide }) => (
  <div className="relative w-full">
    <div
      className="h-48 sm:h-64 md:h-80 lg:h-96 w-full bg-cover bg-center transition-all duration-300"
      style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-white p-4 max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">{slides[currentSlide].title}</h2>
          <p className="text-xs sm:text-sm md:text-base mt-2 max-w-md">{slides[currentSlide].description}</p>
        </div>
      </div>
    </div>
  </div>
);

const ProductGrid = ({ title, products }) => {
  const [visible, setVisible] = useState(false);

  return (
    <section className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {visible && (
        <div className="fixed inset-0 w-full h-full bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out sm:w-96 sm:left-auto sm:right-0">
          <div className="relative h-full flex flex-col">
            <button
              onClick={() => setVisible(false)}
              className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 p-4 pt-16 overflow-y-auto">
              <CartItems />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">{title}</h2>
        <a href="/shop">
          <button className="w-full sm:w-auto bg-primary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-primary-dark transition-colors">
            View All
          </button>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {products?.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts.data);
        dispatch(getProducts(fetchedProducts.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const carouselSlides = [
    {
      title: "50% OFF",
      description: "Surprise your loved ones with our Special Gifts",
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "New Arrivals",
      description: "Check out our latest collection of gifts",
      image: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg"
    },
    {
      title: "Special Offers",
      description: "Limited time deals on selected items",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollProgress />
      <main className="pb-8">
        <Carousel slides={carouselSlides} currentSlide={currentSlide} />
        <ProductGrid title="Top Picks" products={products} />
      </main>
    </div>
  );
};

export default HomePage;