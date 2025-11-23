// src/pages/Leads.jsx
import React, { useEffect, useState, useRef } from "react";
import useLeadStore from "../store/leadStore";
import LeadFormModal from "../components/leads/LeadFormModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { Link } from "react-router-dom";
import * as apptApi from "../api/appointments";

function StageBadge({ stage }) {
  const map = {
    New: "bg-sky-100 text-sky-800",
    Contacted: "bg-amber-100 text-amber-800",
    Qualified: "bg-emerald-100 text-emerald-800",
    Converted: "bg-violet-100 text-violet-800",
  };
  return (
    <span className={`badge ${map[stage] || "bg-gray-100 text-gray-800"}`}>
      {stage}
    </span>
  );
}

export default function Leads() {
  const { leads, fetchLeads, loading } = useLeadStore();
  const deleteLead = useLeadStore((s) => s.deleteLead);
  const updateStage = useLeadStore((s) => s.updateStage);

  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // filters state
  const [qName, setQName] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // follow up
  const [todayFollowups, setTodayFollowups] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  // debounce
  const debounceRef = useRef(null);

  // initial load
  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line
  }, []);

  // whenever filters change, refetch (debounced for search)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadLeads();
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line
  }, [qName, stageFilter, sourceFilter, createdFrom, createdTo]);

  const buildParams = () => {
    const p = {};
    if (qName) p.name = qName;
    if (stageFilter) p.stage = stageFilter;
    if (sourceFilter) p.source = sourceFilter;
    if (createdFrom) p.createdFrom = createdFrom; // yyyy-mm-dd
    if (createdTo) p.createdTo = createdTo;
    return p;
  };

  const loadLeads = async () => {
    try {
      await fetchLeads(buildParams());
    } catch (err) {
      console.error("Failed to load leads", err);
    }
  };

  const clearFilters = () => {
    setQName("");
    setStageFilter("");
    setSourceFilter("");
    setCreatedFrom("");
    setCreatedTo("");
  };

  const onDelete = async (id) => {
    try {
      await deleteLead(id);
      setConfirm({ open: false, id: null });
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Delete failed");
    }
  };

  const onStageChange = async (lead, newStage) => {
    try {
      await updateStage(lead._id, newStage);
      // reload list to reflect sorting / counts
      loadLeads();
    } catch (err) {
      alert(
        err?.response?.data?.message || err.message || "Stage update failed"
      );
    }
  };

  const loadTodayFollowups = async () => {
    try {
      console.log("I amhereeee1111111111eeee");
      setFollowLoading(true);

      const res = await apptApi.todaysAppointment();
      console.log("res======", res);
      // const data = await res.json();
      setTodayFollowups(res);
    } catch (err) {
      console.error("Failed followups", err);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    console.log("I amhereeeeeeee");
    loadLeads();
    loadTodayFollowups();
  }, []);

  return (
    <div className=" sm-w-full space-y-2 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">
          Leads
        </h2>
        <button
          onClick={() => setOpenAdd(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 w-full md:w-auto"
        >
          + Add Lead
        </button>
      </div>

      {/* Follow-up Reminders */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex gap-2 items-center">
              🔔 Today’s Follow-ups
            </h3>
            <p className="text-muted text-sm">
              {followLoading
                ? "Loading..."
                : todayFollowups.length === 0
                ? "No follow-ups scheduled for today"
                : `${todayFollowups.length} follow-ups today`}
            </p>
          </div>
        </div>

        {!followLoading && todayFollowups.length > 0 && (
          <div className="mt-3 space-y-2">
            {todayFollowups.slice(0, 5).map((f) => (
              <div
                key={f._id}
                className="bg-white/70 border border-amber-200 rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {f.lead?.name || "Unknown Lead"}
                  </div>
                  <div className="text-sm text-muted">
                    {new Date(f.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" — "}
                    {f.reason || "No reason"}
                  </div>
                </div>
                <Link
                  to={`/leads/${f.leadId}`}
                  className="px-3 py-1 bg-amber-500 text-white rounded-lg"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            placeholder="Search by name"
            value={qName}
            onChange={(e) => setQName(e.target.value)}
            className="input"
          />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="input"
          >
            <option value="">Filter by Stage</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Converted</option>
          </select>

          <input
            placeholder="Source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="input"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
              className="input"
            />
            <input
              type="date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Loading / Empty states */}
      {loading && (
        <div className="p-6 bg-white/40 card-glass">Loading leads...</div>
      )}
      {!loading && (!leads || leads.length === 0) && (
        <div className="p-6 bg-white/40 card-glass">
          <p className="text-muted">No leads found for selected filters.</p>
        </div>
      )}

      {/* Desktop table */}
      {/* <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr className="text-sm text-muted">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Stage</th>
              <th>Created</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr
                key={l._id}
                className="border-b hover:bg-white/40 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium">{l.name}</div>
                </td>
                <td>{l.email}</td>
                <td>{l.phone}</td>
                <td>{l.source || "Website"}</td>
                <td>
                  <div className="space-y-1">
                    <StageBadge stage={l.stage} />
                  </div>
                </td>
                <td className="text-sm text-muted">
                  {new Date(l.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right pr-4 space-x-2">
                  <Link
                    to={`/leads/${l._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setEditing(l)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirm({ open: true, id: l._id })}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Mobile cards */}
      {/* <div className="md:hidden space-y-3">
        {leads.map((l) => (
          <div key={l._id} className="bg-white/60 rounded-2xl p-4 card-glass">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-lg">{l.name}</div>
                <div className="text-sm text-muted mt-1">
                  {l.email || l.phone}
                </div>
              </div>
              <div className="text-right">
                <StageBadge stage={l.stage} />
                <div className="text-xs text-muted mt-2">{l.source || "—"}</div>
                <div className="mt-3 flex gap-2">
                  <Link to={`/leads/${l._id}`} className="text-sky-700">
                    View
                  </Link>
                  <button
                    onClick={() => setEditing(l)}
                    className="text-amber-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> */}



{/* Responsive Scrollable Table (works for mobile + desktop) */}
<div 
// style={{maxWidth:"20%",minWidth:"50%",overflow:"auto"}}
//  className=" rounded-2xl glass"
 className="w-[50%] sm:w-full overflow-auto rounded-2xl glass"
 >
  <table className="min-w-max w-[100%] text-left">
    <thead className="border-b bg-white/50">
      <tr className="text-sm text-muted">
        <th className="p-4 whitespace-nowrap">Name</th>
        <th className="whitespace-nowrap">Email</th>
        <th className="whitespace-nowrap">Phone</th>
        <th className="whitespace-nowrap">Source</th>
        <th className="whitespace-nowrap">Stage</th>
        <th className="whitespace-nowrap">Created</th>
        <th className="text-right pr-4 whitespace-nowrap">Actions</th>
      </tr>
    </thead>

    <tbody>
      {leads.map((l) => (
        <tr
          key={l._id}
          className="border-b hover:bg-white/40 transition-colors"
        >
          <td className="p-4 whitespace-nowrap">
            <div className="font-medium">{l.name}</div>
          </td>

          <td className="whitespace-nowrap">{l.email}</td>
          <td className="whitespace-nowrap">{l.phone}</td>
          <td className="whitespace-nowrap">{l.source || "Website"}</td>

          <td className="whitespace-nowrap">
            <StageBadge stage={l.stage} />
          </td>

          <td className="text-sm text-muted whitespace-nowrap">
            {new Date(l.createdAt).toLocaleDateString()}
          </td>

          <td className="text-right pr-4 space-x-2 whitespace-nowrap">
            <Link
              to={`/leads/${l._id}`}
              className="px-3 py-1 bg-blue-500 text-white rounded-md"
            >
              View
            </Link>
            <button
              onClick={() => setEditing(l)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirm({ open: true, id: l._id })}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




      <LeadFormModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSaved={() => loadLeads()}
      />
      <LeadFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        initialData={editing}
        onSaved={() => loadLeads()}
      />

      <ConfirmModal
        open={confirm.open}
        title="Delete lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
