import { ImageIcon } from "lucide-react";

/**
 * Evidence attached to a job or a request. The mock data carries captions
 * rather than files, so each tile is drawn rather than loaded — the layout is
 * what a real thumbnail grid would use.
 */
export function FsPhotoTiles({
  photos,
}: {
  photos: { id: string; caption: string; kind?: string }[];
}) {
  return (
    <ul className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo) => (
        <li key={photo.id}>
          <span className="flex h-[92px] items-center justify-center rounded-lg border border-hairline bg-gray-50">
            <ImageIcon aria-hidden="true" className="h-6 w-6 text-gray-300" />
          </span>
          <span className="mt-1.5 block truncate text-[13px] text-gray-600">
            {photo.kind ? (
              <span className="font-semibold text-ink">{photo.kind}: </span>
            ) : null}
            {photo.caption}
          </span>
        </li>
      ))}
    </ul>
  );
}
