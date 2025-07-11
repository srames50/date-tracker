import { useState } from 'react';
import './AddDateModal.css';

const AddDateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photoUrls: [],
    date: '',
  });

  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  setImageUploading(true);
  const urls = [];

  try {
    for (let file of files) {
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('upload_preset', 'date-tracker-upload');

      const res = await fetch('https://api.cloudinary.com/v1_1/dvkl0fnfv/image/upload', {
        method: 'POST',
        body: fileData,
      });

      const data = await res.json();
      urls.push(data.secure_url);
    }

    setFormData(prev => ({ ...prev, photoUrls: urls }));
  } catch (err) {
    console.error('Image upload failed:', err);
  } finally {
    setImageUploading(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dates`, {
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
            multiple
            onChange={handleFileChange}
          />

          {imageUploading && <p>Uploading image...</p>}
          {formData.photoUrls.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {formData.photoUrls.map((url, i) => (
                <img key={i} 
                src={url} 
                alt={`preview-${i}`} 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
            ))}
            </div>
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
