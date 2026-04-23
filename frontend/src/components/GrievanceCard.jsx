const GrievanceCard = ({ grievance, onEdit, onDelete }) => {
  const categoryClass = `badge-${grievance.category.toLowerCase()}`;
  const statusClass = grievance.status === "Pending" ? "badge-pending" : "badge-resolved";

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grievance-card" id={`grievance-${grievance._id}`}>
      <div className="grievance-card-header">
        <h4 className="grievance-card-title">{grievance.title}</h4>
      </div>
      <p className="grievance-card-desc">{grievance.description}</p>
      <div className="grievance-card-meta">
        <span className={`badge ${categoryClass}`}>
          {grievance.category}
        </span>
        <span className={`badge ${statusClass}`}>
          {grievance.status === "Pending" ? "⏳" : "✅"} {grievance.status}
        </span>
        <span className="date-text">
          📅 {formatDate(grievance.date)}
        </span>
      </div>
      <div className="grievance-card-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(grievance)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(grievance._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default GrievanceCard;
