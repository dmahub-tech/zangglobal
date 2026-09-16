import { motion } from "framer-motion";
import GalleryModal from "./GalleryModal";
import { useState } from "react";

const GalleryGrid = ({ items, compact = false }) => {
  const [selected, setSelected] = useState(null);
  return <><div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
    {items.map((item, index) => <motion.button key={item.galleryId} type="button" onClick={() => setSelected(item)} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-secondary" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }} whileHover={{ y: -4 }}>
      <img src={item.imageUrl} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-12 text-white"><strong className="block">{item.name}</strong><span className="mt-1 block text-sm">{item.role} | {item.cohort}, {item.year}</span></span>
    </motion.button>)}
  </div><GalleryModal item={selected} onClose={() => setSelected(null)} /></>;
};
export default GalleryGrid;
