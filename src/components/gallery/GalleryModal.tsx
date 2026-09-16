import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const GalleryModal = ({ item, onClose }) => {
  const closeButton = useRef(null);
  useEffect(() => {
    if (!item) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [item, onClose]);
  return <AnimatePresence>{item && <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
    <motion.section role="dialog" aria-modal="true" aria-labelledby="gallery-dialog-title" className="grid max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white md:grid-cols-[1.15fr_0.85fr]" initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 16 }}>
      <div className="min-h-64 bg-gray-100"><img src={item.imageUrl} alt={item.name} className="h-full max-h-[65vh] w-full object-contain" /></div>
      <div className="relative p-6 text-gray-800"><button ref={closeButton} type="button" aria-label="Close image details" onClick={onClose} className="absolute right-3 top-3 rounded p-2 text-gray-600 hover:bg-gray-100"><X size={20} /></button><p className="pr-10 text-sm font-semibold uppercase text-primary">{item.role}</p><h2 id="gallery-dialog-title" className="mt-1 text-2xl font-bold">{item.name}</h2><dl className="mt-6 space-y-3 text-sm"><div><dt className="font-semibold text-gray-500">Cohort</dt><dd>{item.cohort} ({item.year})</dd></div><div><dt className="font-semibold text-gray-500">Category</dt><dd>{item.category}</dd></div></dl>{item.bio && <p className="mt-6 border-t pt-5 leading-relaxed text-gray-600">{item.bio}</p>}</div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
};
export default GalleryModal;
