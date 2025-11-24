import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import {
  getLeadsWeekly,
  getLeadsByStage,
  getConversionTrend,
  getSourcePerformance,
  getUpcomingFollowups,
  getConversionRate,
} from '../api/reports';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';

const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#F97316', '#EF4444'];

export default function Dashboard() {
  const [rangePreset, setRangePreset] = useState('7');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [weekly, setWeekly] = useState([]);
  const [byStage, setByStage] = useState([]);
  const [conversionTrend, setConversionTrend] = useState([]);
  const [bySource, setBySource] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [kpis, setKpis] = useState({ totalLeads: 0, todayAppts: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const getRange = () => {
    if (rangePreset === 'custom' && customStart && customEnd) {
      return { start: customStart, end: customEnd };
    }
    const today = new Date();
    if (rangePreset === '1') {
      const d = format(today, 'yyyy-MM-dd');
      return { start: d, end: d };
    }
    const days = parseInt(rangePreset, 10) || 7;
    const start = format(subDays(today, days - 1), 'yyyy-MM-dd');
    const end = format(today, 'yyyy-MM-dd');
    return { start, end };
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const k = await getConversionRate();
      setKpis({
        totalLeads: k.total || 0,
        todayAppts: k.todayAppointments || 0,
        conversionRate: Math.round((k.rate || (k.converted && k.total ? k.converted / k.total : 0)) * 100),
      });
    } catch {}

    try {
      const { start, end } = getRange();
      const w = await getLeadsWeekly({ start, end });
      setWeekly(w || []);

      const s = await getLeadsByStage();
      setByStage(s || []);

      const trend = await getConversionTrend();
      setConversionTrend(trend || []);

      const src = await getSourcePerformance();
      setBySource(src || []);

      const ups = await getUpcomingFollowups(7);
      setUpcoming(ups || []);
    } catch (err) {
      console.error('Dashboard load error', err);
    } finally {
      setLoading(false);
    }
  };

  const weeklyData = useMemo(() => weekly.map(w => ({ date: w.date, count: w.count })), [weekly]);
  const stageData = useMemo(() => byStage.map(s => ({ name: s.stage, value: s.count })), [byStage]);
  const sourceData = useMemo(() => bySource.map(s => ({ name: s._id || 'Other', value: s.count })), [bySource]);
  const conversionData = useMemo(() => conversionTrend.map(c => ({ month: c.month, leads: c.leads, converted: c.converted, rate: Math.round(c.rate * 100) })), [conversionTrend]);

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
        Dashboard
      </h1>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full mb-6">
        <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
          <BarChart3 className="text-indigo-600" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <p className="text-2xl font-bold">{kpis.totalLeads}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
          <Calendar className="text-green-600" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Today Appointments</p>
            <p className="text-2xl font-bold">{kpis.todayAppts}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
          <TrendingUp className="text-orange-500" size={32} />
          <div>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
            <p className="text-2xl font-bold">{kpis.conversionRate}%</p>
          </div>
        </div>
      </div>

      {/* RANGE FILTERS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['1', '7', '30', '365'].map(r => (
          <button
            key={r}
            onClick={() => {setRangePreset(r), loadAll()}}
            className={`px-4 py-2 rounded-lg border text-sm ${
              rangePreset === r ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            {r === '1' && 'Today'}
            {r === '7' && 'This Week'}
            {r === '30' && 'This Month'}
            {r === '365' && 'This Year'}
          </button>
        ))}

        <button
          onClick={() => setRangePreset('custom')}
          className={`px-4 py-2 rounded-lg border text-sm ${
            rangePreset === 'custom' ? 'bg-indigo-600 text-white' : 'bg-white'
          }`}
        >
          Custom
        </button>
          {/* <button
            onClick={loadAll}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Apply
          </button> */}
      </div>

      {rangePreset === 'custom' && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="date"
            value={customStart}
            onChange={e => setCustomStart(e.target.value)}
            className="border p-2 rounded-lg"
          />
          <input
            type="date"
            value={customEnd}
            onChange={e => setCustomEnd(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>
      )}
        

      {/* CHARTS SECTION */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Leads Weekly */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full overflow-x-auto">
          <h2 className="font-semibold mb-2">Weekly Leads</h2>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage Pie */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full overflow-x-auto">
          <h2 className="font-semibold mb-2">Leads by Stage</h2>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {stageData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="flex flex-col lg:flex-row gap-6 w-full mt-6">
        {/* Conversion Trend */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full overflow-x-auto">
          <h2 className="font-semibold mb-2">Conversion Trend</h2>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#06B6D4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Performance */}
        <div className="bg-white p-4 rounded-xl shadow-md w-full overflow-x-auto">
          <h2 className="font-semibold mb-2">Source Performance</h2>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Follow-ups */}
      {/* <div className="w-full mt-8 bg-white p-5 rounded-xl shadow-md">
        <h2 className="font-semibold mb-4">Upcoming Follow-ups</h2>
        {upcoming.length === 0 && <p className="text-gray-500">No follow-ups in next 7 days.</p>}

        <div className="flex flex-col gap-3">
          {upcoming.map((u, i) => (
            <div key={i} className="p-3 border rounded-lg flex justify-between items-center text-sm sm:text-base">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-gray-600">{u.stage}</p>
              </div>
              <p className="font-semibold text-indigo-600">{u.date}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
