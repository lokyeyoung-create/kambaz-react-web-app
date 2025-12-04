"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFolders, addFolder, updateFolder as updateFolderAction, removeFolder, removeFolders } from "../reducer";
import * as client from "../../../client";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ManageFolders({ courseId }: { courseId: string }) {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { folders } = useSelector((state: any) => state.piazzaReducer);

  const [newFolderName, setNewFolderName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const data = await client.findFoldersForCourse(courseId);
      dispatch(setFolders(data));
    };
    fetchFolders();
  }, [courseId, dispatch]);

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const newFolder = await client.createFolder(courseId, { name: newFolderName.trim() });
      dispatch(addFolder(newFolder));
      setNewFolderName("");
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  const handleStartEdit = (folder: any) => {
    setEditingId(folder._id);
    setEditingName(folder.name);
  };

  const handleSaveEdit = async (folderId: string) => {
    if (!editingName.trim()) return;
    try {
      await client.updateFolder(folderId, { name: editingName.trim() });
      dispatch(updateFolderAction({ _id: folderId, name: editingName.trim() }));
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleToggleSelect = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedFolders.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFolders.length} folder(s)?`)) return;
    try {
      await client.deleteFolders(selectedFolders);
      dispatch(removeFolders(selectedFolders));
      setSelectedFolders([]);
    } catch (error) {
      console.error("Error deleting folders:", error);
    }
  };

  return (
    <div>
      <h4>Configure Class Folders</h4>
      <p className="text-muted">
        Folders allow you to keep class content organized. When students and instructors add a new post,
        they will be required to specify at least one folder for their post.
      </p>

      <div className="mb-4">
        <h5>Create new folder:</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add a folder"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddFolder()}
          />
          <button className="btn btn-primary" onClick={handleAddFolder}>Add Folder</button>
        </div>
      </div>

      <div className="mb-3">
        <h5>Manage folders:</h5>
        {selectedFolders.length > 0 && (
          <button className="btn btn-danger btn-sm mb-2" onClick={handleDeleteSelected}>
            <FaTrash className="me-1" /> Delete selected folders ({selectedFolders.length})
          </button>
        )}
      </div>

      <ul className="list-group">
        {folders.map((folder: any) => (
          <li key={folder._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={selectedFolders.includes(folder._id)}
                onChange={() => handleToggleSelect(folder._id)}
              />
              {editingId === folder._id ? (
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                />
              ) : (
                <span>{folder.name}</span>
              )}
            </div>
            <div>
              {editingId === folder._id ? (
                <>
                  <button className="btn btn-success btn-sm me-1" onClick={() => handleSaveEdit(folder._id)}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleStartEdit(folder)}>
                  <FaEdit className="me-1" /> Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}