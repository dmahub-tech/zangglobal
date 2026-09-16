import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import ProductCard from "../../components/user/ProductCard";
import { fetchProducts } from "../../config/api";
import { Loader2 } from "lucide-react";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!queryText.trim()) {
      setFilteredResults([]);
      return;
    }

    if (products.length > 0) {
      const filteredByName = products.filter((product) =>
        product?.name?.toLowerCase().includes(queryText.toLowerCase())
      );
      const filteredByCategory = products.filter((product) =>
        product?.category?.toLowerCase().includes(queryText.toLowerCase())
      );

      // Combine and remove duplicates
      const uniqueResults = [...new Map([...filteredByName, ...filteredByCategory].map((p) => [p.id, p])).values()];
      setFilteredResults(uniqueResults);
    }
  }, [queryText, products]);

  return (
    <div className="min-h-screen mt-[50px] p-4">
      <h1 className="text-2xl font-semibold mb-4">Search Products</h1>

      {/* Search Input */}
      <div className="relative w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search for products..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
        {queryText && (
          <button onClick={() => setQueryText("")} className="absolute right-3 top-2.5">
            <FaTimes className="text-gray-400" size={18} />
          </button>
        )}
      </div>

      {/* Display Results */}
      <div className="mt-6 px-5">
        {loading ? (
          <div className="w-full flex-col h-[80vh] flex items-center justify-center">
            <Loader2 size={60} className="my-2 text-mutedPrimary animate-spin" />
            <p>Loading products...</p>
          </div>
        ) : queryText === "" ? (
          <div className="w-full flex-col h-[80vh] flex items-center justify-center">
            <p className="text-gray-600">Start typing to search for products...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#ebeef3] w-full h-[80vh]">
            <img src="./notFound.jpg" width={400} alt="Not found" className="rounded-lg" />
            <p className="mt-2 text-gray-600">No results found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {filteredResults.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
