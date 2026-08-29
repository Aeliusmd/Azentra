/**
 * Photo upload for the tenant's forms.
 *
 * Re-exported rather than rewritten: the dropzone validates types and sizes and
 * previews from object URLs, none of which is resident-specific. One
 * implementation, so both portals get the same handling of a 12MB HEIC.
 */
export { ResPhotoDropzone as TenPhotoDropzone } from "@/components/res/ui/photo-dropzone";
