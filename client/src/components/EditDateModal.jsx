// src/components/EditDateModal.jsx
import React, { useState } from 'react';
import './AddDateModal.css'; // reuse styles

const EditDateModal = ({ onClose, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    date: initialData.date ? initialData.date.slice(0, 10) : '',
    photoUrls: initialData.photoUrls || [],
  });

  // const [newPhotos, setNewPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', 'date-tracker-upload');

          const res = await fetch('https://api.cloudinary.com/v1_1/dvkl0fnfv/image/upload', {
            method: 'POST',
            body: data,
          });

          const json = await res.json();
          console.log('Cloudinary upload response:', json);
          if (!json.secure_url) {
            throw new Error('Upload failed, no URL returned');
          }
          return json.secure_url;
        })
      );

      setFormData(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...uploaded],
      }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = (url) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: prev.photoUrls.filter(photo => photo !== url),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    
    try {
      const res = await fetch(`http://localhost:5050/api/dates/${initialData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const updated = await res.json();
      onUpdate(updated); // Update local state
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Date</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input name="date" type="date" value={formData.date} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          {uploading && <p>Uploading...</p>}

          <div className="edit-preview-gallery">
            {formData.photoUrls.map((url, i) => (
              <div key={i} className="edit-thumb">
                <img src={url} alt={`Uploaded ${i}`} />
                <button type="button" onClick={() => handleDeletePhoto(url)}>✕</button>
              </div>
            ))}
          </div>

          <button type="submit">Save Changes</button>
        </form>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditDateModal;
