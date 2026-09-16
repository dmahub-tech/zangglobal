import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GalleryGrid from "./GalleryGrid";
import { useGalleryItems } from "../../hooks/useGallery";

const FeaturedGallery = () => {
  const { data, isLoading, error } = useGalleryItems({ featured: true, page: 1, limit: 4 });
  if (error || (!isLoading && !data?.items?.length)) return null;
  return <section className="bg-gray-50 px-6 py-16 md:px-10"><div className="mx-auto max-w-7xl"><motion.div className="mb-8 flex flex-wrap items-end justify-between gap-4" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><div><p className="font-semibold uppercase text-primary">Featured people</p><h2 className="mt-2 text-3xl font-bold text-gray-900">Learning in action</h2></div><Link to="/gallery" className="rounded bg-primary px-4 py-2 font-medium text-white transition hover:bg-mutedPrimary">View Full Gallery</Link></motion.div>{isLoading ? <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200" />)}</div> : <GalleryGrid items={data.items} compact />}</div></section>;
};
export default FeaturedGallery;
