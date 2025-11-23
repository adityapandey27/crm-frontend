// src/pages/Appointments.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  getAllAppointments,
  getCalendarAppointments,
  deleteAppointment,
  markDone,
} from "../api/appointments";
import { CalendarDays } from "lucide-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { parseISO, format, startOfDay, endOfDay, addDays } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  parse: parseISO,
  format,
  startOfDay,
  endOfDay,
  locales,
});

const STATUS_COLORS = {
  Upcoming: "bg-indigo-100 text-indigo-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
  Missed: "bg-amber-100 text-amber-800",
};

function StatusPill({ status }) {
  const cls = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function AppointmentCard({ appt, onView, onEdit, onDelete, onMarkDone }) {
  const dt = new Date(appt.date);
  const date = dt.toLocaleDateString();
  const time = dt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="p-4 rounded-2xl bg-white/80 shadow-md border border-white/20 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg">
            {appt.leadId?.name || "Unknown"}
          </div>
          <div className="text-sm text-muted">
            {appt.leadId?.phone || appt.leadId?.email || "—"}
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm text-gray-700">Date: {date}</div>
          <div className="text-sm text-gray-700">Time: {time}</div>
          <div className="mt-2">
           Status: <StatusPill status={appt.status || "Upcoming"} />
          </div>
        </div>
      </div>

      {appt.reason && (
        <div>
          <div className="text-sm font-medium text-muted">Reason</div>
          <div className="text-sm">{appt.reason}</div>
        </div>
      )}

      {appt.note && (
        <div>
          <div className="text-sm font-medium text-muted">Notes</div>
          <div className="text-sm">{appt.note}</div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={() => onView(appt)}
          className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm"
        >
          Open Lead
        </button>
        <button
          onClick={() => onEdit(appt)}
          className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onMarkDone(appt._id)}
          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm"
        >
          Mark Done
        </button>
        <button
          onClick={() => onDelete(appt._id)}
          className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function Appointments() {
  const nav = useNavigate();

  // data
  const [appointments, setAppointments] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list"); // list | calendar

  // filters / controls
  const [tab, setTab] = useState("all"); // today / tomorrow / upcoming / past / all
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // fetch list or calendar
  const loadAppointments = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllAppointments(params);
      // API should return array (or object). Accept either {data} or array
      const list = Array.isArray(res) ? res : res?.appointments || res;
      setAppointments(list);
    } catch (err) {
      console.error("Failed to load appts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    applyFilters();
    // eslint-disable-next-line
  }, []);

  // build params based on tab & filters
  const buildParams = () => {
    const p = {};
    // status filter
    if (statusFilter) p.status = statusFilter;
    // search
    if (search) p.search = search;
    // date range
    if (dateFrom) p.start = dateFrom;
    if (dateTo) p.end = dateTo;
    // tab mapping
    const today = new Date();
    if (tab === "today") {
      p.start = format(startOfDay(today), "yyyy-MM-dd");
      p.end = format(endOfDay(today), "yyyy-MM-dd");
    } else if (tab === "tomorrow") {
      const t = addDays(today, 1);
      p.start = format(startOfDay(t), "yyyy-MM-dd");
      p.end = format(endOfDay(t), "yyyy-MM-dd");
    } else if (tab === "upcoming") {
      p.start = format(startOfDay(addDays(today, 0)), "yyyy-MM-dd");
      // leave end empty (API treats absent end as future)
    } else if (tab === "past") {
      // past: end = yesterday
      p.end = format(endOfDay(addDays(today, -1)), "yyyy-MM-dd");
    }
    p.sort = "date";
    p.order = sortOrder;
    return p;
  };

  const applyFilters = () => {
    const p = buildParams();
    loadAppointments(p);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSortOrder("asc");
    applyFilters();
  };

  // actions
  const handleDelete = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    try {
      await deleteAppointment(id);
      applyFilters();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await markDone(id);
      applyFilters();
    } catch (err) {
      alert("Mark done failed");
    }
  };

  const handleEdit = (appt) => {
    // quick edit via prompt for small editing (or open modal if you have one)
    const newReason = window.prompt("Edit reason", appt.reason || "");
    if (newReason === null) return;
    // call API to update
    (async () => {
      try {
        await getAllAppointments(); // (noop) ensure API loaded; real update below
        await fetch(`/api/appointments/${appt._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ reason: newReason }),
        });
        applyFilters();
      } catch (e) {
        console.error(e);
        alert("Update failed");
      }
    })();
  };

  const handleViewLead = (appt) => {
    if (appt.lead && appt.lead._id) {
      navToLead(appt.lead._id);
    } else if (appt.leadId) {
      navToLead(appt.leadId);
    } else {
      alert("No lead linked");
    }
  };

  const navToLead = (leadId) => {
    // use react-router navigate
    // small helper to avoid import conflict
    window.location.href = `/leads/${leadId}`;
  };

  // calendar events mapping
  const events = useMemo(() => {
    // calendarData may be object { '2025-11-19': [...] }
    const arr = [];
    // if calendarData is a mapping
    if (
      calendarData &&
      typeof calendarData === "object" &&
      !Array.isArray(calendarData)
    ) {
      Object.keys(calendarData).forEach((day) => {
        (calendarData[day] || []).forEach((ev) => {
          arr.push({
            id: ev._id,
            title:
              ev.title ||
              ev.reason ||
              (ev.lead && ev.lead.name) ||
              "Appointment",
            start: new Date(ev.time || ev.date),
            end: new Date(ev.time || ev.date),
            allDay: false,
            resource: ev,
          });
        });
      });
    } else if (Array.isArray(appointments)) {
      // fallback map
      appointments.forEach((a) => {
        arr.push({
          id: a._id,
          title: a.reason || a.lead?.name || "Appointment",
          start: new Date(a.date),
          end: new Date(a.date),
          resource: a,
        });
      });
    }
    return arr;
  }, [calendarData, appointments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-muted text-sm">
            Manage all appointments across leads
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by lead or reason"
          className="rounded-full px-4 py-2 border bg-white/60 border-white/10 w-full md:w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full px-4 py-2 border bg-white/60 border-white/10"
        >
          <option value="">All status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Missed">Missed</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded px-3 py-2 border bg-white/60 border-white/10"
          />
          <label className="text-sm text-muted">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded px-3 py-2 border bg-white/60 border-white/10"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-muted">Sort</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-full px-3 py-2 border bg-white/60 border-white/10"
          >
            <option value="asc">Date asc</option>
            <option value="desc">Date desc</option>
          </select>

          <button
            onClick={applyFilters}
            className="px-3 py-2 rounded-lg btn-accent text-white"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 text-sm">
        {["all","today", "tomorrow", "upcoming", "past", ].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              applyFilters();
            }}
            className={`px-3 py-2 rounded-full ${
              tab === t ? "bg-indigo-600 text-white" : "bg-white/40"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* <>
        {loading && (
          <div className="p-6 card-glass">Loading appointments...</div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="p-6 card-glass text-muted">No appointments found</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((a) => (
            <AppointmentCard
              key={a._id}
              appt={a}
              onView={() => handleViewLead(a)}
              onEdit={() => handleEdit(a)}
              onDelete={() => handleDelete(a._id)}
              onMarkDone={() => handleMarkDone(a._id)}
            />
          ))}
        </div>
      </> */}

      {/* <div className="w-[80%] sm:w-full overflow-x-auto rounded-2xl">
  <table className="min-w-[700px] w-full text-left">
    <thead>
      <tr className="border-b text-sm text-gray-600">
        <th className="p-3">Lead</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {appointments.map((a) => (
        <tr key={a._id} className="border-b hover:bg-gray-50">
          <td className="p-3">{a.leadId?.name}</td>
          <td>{new Date(a.date).toLocaleDateString()}</td>
          <td>
            {new Date(a.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>
          <td><StatusPill status={a.status} /></td>
          <td className="space-x-2">
            <button onClick={() => onView(a)} className="text-indigo-600">
              View
            </button>
            <button onClick={() => onEdit(a)} className="text-amber-600">
              Edit
            </button>
            <button
              onClick={() => onMarkDone(a._id)}
              className="text-green-600"
            >
              Done
            </button>
            <button
              onClick={() => onDelete(a._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div> */}

<div className="w-[50%] sm:w-full overflow-auto rounded-2xl glass">
  <table className="min-w-max w-[100%] text-left">
    <thead className="border-b bg-white/50">
      <tr className="text-sm text-muted">
        <th className="p-4 whitespace-nowrap">Lead</th>
        <th className="whitespace-nowrap">Date</th>
        <th className="whitespace-nowrap">Time</th>
        <th className="whitespace-nowrap">Status</th>
        <th className="whitespace-nowrap">Reason</th>
        <th className="whitespace-nowrap">Notes</th>
        <th className="text-right pr-4 whitespace-nowrap">Actions</th>
      </tr>
    </thead>

    <tbody>
      {appointments.map((a) => {
        const dt = new Date(a.date);
        const date = dt.toLocaleDateString();
        const time = dt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <tr
            key={a._id}
            className="border-b hover:bg-white/40 transition-colors"
          >
            <td className="p-4 whitespace-nowrap">
              <div className="font-medium">
                {a.leadId?.name || "Unknown"}
              </div>
              <div className="text-xs text-muted">
                {a.leadId?.phone || a.leadId?.email || "—"}
              </div>
            </td>

            <td className="whitespace-nowrap">{date}</td>
            <td className="whitespace-nowrap">{time}</td>

            <td className="whitespace-nowrap">
              <StatusPill status={a.status} />
            </td>

            <td className="whitespace-nowrap">
              {a.reason || "—"}
            </td>

            <td className="whitespace-nowrap">
              {a.note || "—"}
            </td>

            <td className="text-right pr-4 space-x-2 whitespace-nowrap">
              <button
                onClick={() => onView(a)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                View
              </button>

              <button
                onClick={() => onEdit(a)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => onMarkDone(a._id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-md"
              >
                Done
              </button>

              <button
                onClick={() => onDelete(a._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


    </div>
  );
}
