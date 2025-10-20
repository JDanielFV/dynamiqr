export interface Folder {
  id: string;
  name: string;
}

export interface QRCode {
  id: string;
  name: string;
  destinationUrl: string;
  createdAt: string;
  folderId?: string; // Optional: ID of the folder it belongs to
}
