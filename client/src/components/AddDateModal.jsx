import { useState } from 'react';
import './AddDateModal.css';

const AddDateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoUrl: '',
    date: '',
  });

  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);
    fileData.append('upload_preset', 'date-tracker-upload'); // Your unsigned preset name

    setImageUploading(true);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dvkl0fnfv/image/upload', {
        method: 'POST',
        body: fileData,
      });

      const data = await res.json();
      setFormData(prev => ({ ...prev, photoUrl: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5050/api/dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newDate = await res.json();
      onAdd(newDate);  // update frontend list
      onClose();       // close modal
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add a New Date</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {imageUploading && <p>Uploading image...</p>}
          {formData.photoUrl && (
            <img
              src={formData.photoUrl}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          )}

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <button type="submit" disabled={imageUploading}>Add</button>
        </form>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddDateModal;
