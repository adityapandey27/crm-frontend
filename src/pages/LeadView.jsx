// src/pages/LeadView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as leadApi from "../api/leads";
import * as apptApi from "../api/appointments";
import useLeadStore from "../store/leadStore";

export default function LeadView() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const updateLeadInStore = useLeadStore((s) => s.updateLeadLocal);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const l = await leadApi.getLeadById(id);
      setLead(l);
      setNote(l?.note || "");
      const appts = await leadApi.getLeadAppointments(id);
      setAppointments(appts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    setSavingNote(true);
    try {
      const updated = await leadApi.updateLead(id, { note });
      setLead(updated);
      updateLeadInStore(id, { note: updated.note });
      alert("Note saved");
    } catch (err) {
      alert(
        err?.response?.data?.message || err.message || "Failed to save note"
      );
    } finally {
      setSavingNote(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await apptApi.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a._id !== id));
  };

  const [apptForm, setApptForm] = useState({
    date: "",
    problem: "",
    notes: "",
  });
  const [creatingAppt, setCreatingAppt] = useState(false);

  const createAppt = async () => {
    if (!apptForm.date) {
      alert("Please select date/time");
      return;
    }
    setCreatingAppt(true);
    try {
      const payload = {
        leadId: id,
        date: new Date(apptForm.date).toISOString(),
        problem: apptForm.problem,
        notes: apptForm.notes,
      };
      await apptApi.createAppointment(payload);
      setApptForm({ date: "", problem: "", notes: "" });
      // reload appointments
      const appts = await leadApi.getLeadAppointments(id);
      setAppointments(appts || []);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create appointment"
      );
    } finally {
      setCreatingAppt(false);
    }
  };

  if (loading) return <div className="p-6 card-glass">Loading...</div>;
  if (!lead) return <div className="p-6 card-glass">Lead not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-muted">{lead.email || lead.phone}</p>
        </div>
        <div className="text-sm text-muted">
          Created: {new Date(lead.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Info & Note */}
        <div className="bg-white/60 rounded-2xl p-6 card-glass">
          <h3 className="font-semibold mb-2">Patient / Lead Info</h3>
          <div className="text-sm text-muted mb-4">
            Source: {lead.source || "Website"} • Stage: {lead.stage}
          </div>

          <h4 className="font-medium mb-2">Note</h4>
          <textarea
            className="w-full p-3 rounded-lg bg-white/30 border border-white/20"
            rows="6"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={saveNote}
              disabled={savingNote}
              className="px-4 py-2 rounded-lg btn-accent text-white"
            >
              {savingNote ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        {/* Right: Appointments */}
        <div className="bg-white/60 rounded-2xl p-6 card-glass">
          <h3 className="font-semibold mb-2">Appointments</h3>

          <div className="space-y-3 mb-4">
            <input
              type="datetime-local"
              className="w-full p-3 rounded-lg bg-white/30 border border-white/20"
              value={apptForm.date}
              onChange={(e) =>
                setApptForm((s) => ({ ...s, date: e.target.value }))
              }
            />
            <input
              placeholder="Problem / Reason"
              className="w-full p-3 rounded-lg bg-white/30 border border-white/20"
              value={apptForm.problem}
              onChange={(e) =>
                setApptForm((s) => ({ ...s, problem: e.target.value }))
              }
            />
            <textarea
              placeholder="Notes"
              className="w-full p-3 rounded-lg bg-white/30 border border-white/20"
              rows={3}
              value={apptForm.notes}
              onChange={(e) =>
                setApptForm((s) => ({ ...s, notes: e.target.value }))
              }
            />
            <div className="flex justify-end">
              <button
                onClick={createAppt}
                disabled={creatingAppt}
                className="px-4 py-2 rounded-lg btn-accent text-white"
              >
                {creatingAppt ? "Creating..." : "Add Appointment"}
              </button>
            </div>
          </div>

          <div className="bg-white/60 rounded-2xl  space-y-4">
            {appointments.length === 0 && (
              <div className="text-muted text-sm">No appointments yet.</div>
            )}
            <div className="space-y-4">
              {appointments.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl glass border border-white/10 bg-white/40 flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted mt-1">
                      {app.time || "—"}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-semibold">Purpose: </span>
                      {app.notes || "—"}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-semibold">Purpose: </span>
                      {app.problem || "—"}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAppointment(app._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
