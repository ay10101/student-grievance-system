import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import GrievanceForm from "../components/GrievanceForm";
import GrievanceCard from "../components/GrievanceCard";

const Dashboard = () => {
  const { api, user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch all grievances
  const fetchGrievances = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await api.get("/grievances");
      setGrievances(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load grievances" });
    } finally {
      setLoadingData(false);
    }
  }, [api]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  // Search grievances
  const handleSearch = useCallback(async (term) => {
    try {
      if (!term.trim()) {
        fetchGrievances();
        return;
      }
      const res = await api.get(`/grievances/search?title=${encodeURIComponent(term)}`);
      setGrievances(res.data);
    } catch (err) {
      setMessage({ type: "error", text: "Search failed" });
    }
  }, [api, fetchGrievances]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  // Submit new grievance
  const handleSubmit = async (data) => {
    try {
      await api.post("/grievances", data);
      setShowForm(false);
      setMessage({ type: "success", text: "Grievance submitted successfully!" });
      fetchGrievances();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to submit" });
    }
  };

  // Update grievance
  const handleUpdate = async (data) => {
    try {
      await api.put(`/grievances/${editData._id}`, data);
      setEditData(null);
      setShowForm(false);
      setMessage({ type: "success", text: "Grievance updated successfully!" });
      fetchGrievances();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update" });
    }
  };

  // Delete grievance
  const handleDelete = async () => {
    try {
      await api.delete(`/grievances/${deleteId}`);
      setDeleteId(null);
      setMessage({ type: "success", text: "Grievance deleted successfully!" });
      fetchGrievances();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete" });
      setDeleteId(null);
    }
  };

  // Open edit form
  const openEdit = (grievance) => {
    setEditData(grievance);
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  // Stats
  const totalCount = grievances.length;
  const pendingCount = grievances.filter((g) => g.status === "Pending").length;
  const resolvedCount = grievances.filter((g) => g.status === "Resolved").length;

  return (
    <>
      <Navbar />
      <div className="dashboard" id="dashboard">
        <div className="dashboard-header">
          <h2>My Grievances</h2>
          <p>Submit, track, and manage your complaints</p>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h3>{totalCount}</h3>
              <p>Total Grievances</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{pendingCount}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon resolved">✅</div>
            <div className="stat-info">
              <h3>{resolvedCount}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="dashboard-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search grievances by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="search-input"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setEditData(null); setShowForm(true); }}
            id="new-grievance-btn"
          >
            ➕ New Grievance
          </button>
        </div>

        {/* Grievance List */}
        {loadingData ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: "0 auto", width: 40, height: 40, borderWidth: 3 }}></div>
          </div>
        ) : grievances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>{searchTerm ? "No results found" : "No grievances yet"}</h3>
            <p>
              {searchTerm
                ? "Try a different search term"
                : "Click \"New Grievance\" to submit your first complaint"}
            </p>
          </div>
        ) : (
          <div className="grievances-grid">
            {grievances.map((g) => (
              <GrievanceCard
                key={g._id}
                grievance={g}
                onEdit={openEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}

        {/* Grievance Form Modal */}
        {showForm && (
          <GrievanceForm
            onSubmit={editData ? handleUpdate : handleSubmit}
            onCancel={closeForm}
            editData={editData}
          />
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="confirm-overlay" onClick={() => setDeleteId(null)}>
            <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
              <h3>🗑️ Delete Grievance?</h3>
              <p>This action cannot be undone. Are you sure?</p>
              <div className="confirm-actions">
                <button className="btn btn-danger" onClick={handleDelete} id="confirm-delete-btn">
                  Yes, Delete
                </button>
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
