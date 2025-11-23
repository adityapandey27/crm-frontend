import React from "react";
import { X } from "lucide-react";

export default function FollowupDrawer({ open, onClose, items, onMarkDone, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div className="w-[380px] bg-white/70 backdrop-blur-xl p-6 shadow-2xl h-full overflow-y-auto card-glass fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Today's Follow-ups</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 && (
          <div className="text-muted text-center mt-20">No follow-ups today</div>
        )}

        <div className="space-y-4">
          {items.map((it) => (
            <div key={it._id} className="glass rounded-2xl p-4 space-y-3">

              <div className="flex justify-between">
                <div>
                  <div className="font-semibold text-lg">{it.leadId?.name}</div>
                  <div className="text-muted text-sm">{it.leadId?.phone}</div>
                </div>
                <span className="badge bg-indigo-100 text-indigo-800">
                  {new Date(it.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {it.problem && (
                <div>
                  <div className="text-sm font-medium text-muted">Problem / Reason</div>
                  <div className="p-2 rounded-xl bg-white/50">{it.problem}</div>
                </div>
              )}

              {it.note && (
                <div>
                  <div className="text-sm font-medium text-muted">Note</div>
                  <div className="p-2 rounded-xl bg-white/50">{it.note}</div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <a
                  href={`/leads/${it.leadId?._id}`}
                  className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-sm"
                >
                  View Lead
                </a>

                <button
                  onClick={() => onMarkDone(it._id)}
                  className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-sm"
                >
                  Mark Done
                </button>

                <button
                  onClick={() => onDelete(it._id)}
                  className="px-3 py-1 rounded-xl bg-red-600 text-white text-sm"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
