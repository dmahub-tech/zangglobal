import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../config/api";

export const GALLERY_QUERY_KEYS = {
  all: ["gallery"],
  list: (scope, filters) => ["gallery", scope, filters],
  metadata: ["gallery", "metadata"],
  cohorts: ["gallery", "cohorts"],
};

const adminHeaders = () => ({ Authorization: `Bearer ${JSON.parse(localStorage.getItem("token") || "null") || localStorage.getItem("adminToken") || ""}` });
const galleryApi = {
  list: (params = {}, admin = false) => api.get(admin ? "/gallery/admin/all" : "/gallery", { params }).then((response) => response.data),
  metadata: () => api.get("/gallery/categories").then((response) => response.data),
  cohorts: () => api.get("/gallery/cohorts").then((response) => response.data),
  create: (data) => api.post("/gallery", data, { headers: adminHeaders() }).then((response) => response.data),
  update: ({ id, ...data }) => api.patch(`/gallery/${id}`, data, { headers: adminHeaders() }).then((response) => response.data),
  remove: (id) => api.delete(`/gallery/${id}`, { headers: adminHeaders() }).then((response) => response.data),
  upload: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/gallery/upload", formData, { headers: { ...adminHeaders(), "Content-Type": "multipart/form-data" } }).then((response) => response.data);
  },
  createCohort: (data) => api.post("/gallery/cohorts", data, { headers: adminHeaders() }).then((response) => response.data),
};

export const useGalleryItems = (filters = {}, admin = false) => useQuery({
  queryKey: GALLERY_QUERY_KEYS.list(admin ? "admin" : "public", filters),
  queryFn: () => galleryApi.list(filters, admin),
  select: (data) => ({ items: data.data, pagination: data.pagination }),
  placeholderData: (previous) => previous,
});

export const useGalleryMetadata = () => useQuery({
  queryKey: GALLERY_QUERY_KEYS.metadata,
  queryFn: galleryApi.metadata,
  select: (data) => data.data,
  staleTime: 15 * 60 * 1000,
});

export const useCohorts = () => useQuery({ queryKey: GALLERY_QUERY_KEYS.cohorts, queryFn: galleryApi.cohorts, select: (data) => data.data });
export const usePublicGalleryItems = (filters = {}) => useGalleryItems(filters);

const invalidateGallery = (queryClient) => queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
const mutation = (mutationFn, message) => () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => { invalidateGallery(queryClient); toast.success(message); }, onError: (error) => toast.error(error?.response?.data?.message || "Unable to update gallery content") });
};
export const useCreateGalleryItem = mutation(galleryApi.create, "Gallery entry created");
export const useUpdateGalleryItem = mutation(galleryApi.update, "Gallery entry updated");
export const useDeleteGalleryItem = mutation(galleryApi.remove, "Gallery entry deleted");
export const useCreateCohort = mutation(galleryApi.createCohort, "Cohort created");
export const useUploadGalleryImage = () => useMutation({ mutationFn: galleryApi.upload, onError: (error) => toast.error(error?.response?.data?.message || "Unable to upload image. Check the file type and maximum file size.") });
