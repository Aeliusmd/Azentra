/**
 * A file the resident picked in the browser.
 *
 * Frontend only: `url` is an object URL, so the file is previewable but has not
 * left the machine. Shared by the maintenance and complaint forms, which both
 * attach evidence the same way.
 */
export type ResUpload = {
  id: string;
  name: string;
  /** Object URL of the picked file — never uploaded anywhere. */
  url: string;
};
