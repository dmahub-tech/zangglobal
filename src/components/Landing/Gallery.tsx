import { useEffect, useState } from "react";
import GalleryFilters from "../gallery/GalleryFilters";
import GalleryGrid from "../gallery/GalleryGrid";
import { useGalleryItems, useGalleryMetadata } from "../../hooks/useGallery";

const emptyFilters = { search: "", year: "", cohort: "", category: "", role: "" };
const Gallery = () => {
  const [filters, setFilters] = useState(emptyFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const metadata = useGalleryMetadata();
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(filters.search), 300); return () => clearTimeout(timer); }, [filters.search]);
  const queryFilters = { ...filters, search: debouncedSearch, page, limit: 24 };
  Object.keys(queryFilters).forEach((key) => !queryFilters[key] && delete queryFilters[key]);
  const { data, isLoading, isFetching, error } = useGalleryItems(queryFilters);
  const updateFilter = (key, value) => { setPage(1); setFilters((current) => ({ ...current, [key]: value })); };
  const reset = () => { setFilters(emptyFilters); setPage(1); };
  return <section className="min-h-screen bg-gray-50 px-4 py-14 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="mb-8 max-w-2xl"><p className="font-semibold uppercase text-primary">People and programs</p><h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Zang Global Gallery</h1><p className="mt-3 text-gray-600">Meet the students and trainers behind our cohort programs.</p></header><GalleryFilters filters={filters} metadata={metadata.data} onChange={updateFilter} onReset={reset} />
    {error ? <div className="mt-8 rounded border border-red-200 bg-red-50 p-5 text-red-800">Unable to load gallery images. Please refresh and try again.</div> : isLoading ? <div className="grid grid-cols-2 gap-5 py-8 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-lg bg-gray-200" />)}</div> : data?.items?.length ? <><div className="mt-8"><GalleryGrid items={data.items} /></div><div className="mt-8 flex items-center justify-between"><p className="text-sm text-gray-600">{data.pagination.total} result{data.pagination.total === 1 ? "" : "s"}{isFetching ? " - updating" : ""}</p><div className="flex gap-3"><button type="button" disabled={page <= 1 || isFetching} onClick={() => setPage((current) => current - 1)} className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" disabled={page >= data.pagination.pages || isFetching} onClick={() => setPage((current) => current + 1)} className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div></> : <div className="py-20 text-center"><h2 className="text-xl font-semibold text-gray-800">No gallery images found.</h2><p className="mt-2 text-gray-600">Try changing your filters or search.</p></div>}</div></section>;
};
export default Gallery;
