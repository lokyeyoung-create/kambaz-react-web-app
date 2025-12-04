"use client";

export default function FolderFilters({
  folders,
  selectedFolder,
  onSelectFolder,
}: {
  folders: any[];
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
}) {
  return (
    <div className="bg-light border-bottom px-3 py-2 d-flex flex-wrap gap-2" style={{ position: "sticky", top: 56, zIndex: 99 }}>
      <span
        className={`badge ${!selectedFolder ? "bg-primary" : "bg-secondary"}`}
        style={{ cursor: "pointer" }}
        onClick={() => onSelectFolder(null)}
      >
        All
      </span>
      {folders.map((folder) => (
        <span
          key={folder._id}
          className={`badge ${selectedFolder === folder.name ? "bg-primary" : "bg-secondary"}`}
          style={{ cursor: "pointer" }}
          onClick={() => onSelectFolder(folder.name)}
        >
          {folder.name}
        </span>
      ))}
    </div>
  );
}