import { useState, useEffect } from "react";

const GrievanceForm = ({ onSubmit, onCancel, editData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Academic");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDescription(editData.description || "");
      setCategory(editData.category || "Academic");
      setStatus(editData.status || "Pending");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { title, description, category };
    if (editData) data.status = status;
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div
        className="grievance-form-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>
          {editData ? "✏️ Edit Grievance" : "📝 Submit Grievance"}
        </h3>
        <form onSubmit={handleSubmit} id="grievance-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="Brief title for your grievance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe your grievance in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {editData && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          )}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="submit-grievance-btn"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : editData ? (
                "Update Grievance"
              ) : (
                "Submit Grievance"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrievanceForm;
