"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [schedules, setSchedules] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Forms state
  const [scheduleForm, setScheduleForm] = useState<any>({});
  const [dateForm, setDateForm] = useState<any>({});
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editingDateId, setEditingDateId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, datesRes] = await Promise.all([
        fetchApi('/schedules'),
        fetchApi('/eventdates')
      ]);
      setSchedules(schedulesRes);
      setDates(datesRes);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  // Schedule Handlers
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScheduleId) {
        await fetchApi(`/schedules/${editingScheduleId}`, {
          method: 'PUT',
          body: JSON.stringify(scheduleForm)
        });
      } else {
        await fetchApi('/schedules', {
          method: 'POST',
          body: JSON.stringify(scheduleForm)
        });
      }
      setShowScheduleModal(false);
      setScheduleForm({});
      setEditingScheduleId(null);
      loadData();
    } catch (error) {
      console.error("Error saving schedule", error);
      alert('Error saving data');
    }
  };

  const handleEditSchedule = (item: any) => {
    setScheduleForm(item);
    setEditingScheduleId(item._id);
    setShowScheduleModal(true);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await fetchApi(`/schedules/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting schedule", error);
    }
  };

  // Date Handlers
  const handleDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDateId) {
        await fetchApi(`/eventdates/${editingDateId}`, {
          method: 'PUT',
          body: JSON.stringify(dateForm)
        });
      } else {
        await fetchApi('/eventdates', {
          method: 'POST',
          body: JSON.stringify(dateForm)
        });
      }
      setShowDateModal(false);
      setDateForm({});
      setEditingDateId(null);
      loadData();
    } catch (error) {
      console.error("Error saving date", error);
      alert('Error saving data');
    }
  };

  const handleEditDate = (item: any) => {
    setDateForm(item);
    setEditingDateId(item._id);
    setShowDateModal(true);
  };

  const handleDeleteDate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this date?')) return;
    try {
      await fetchApi(`/eventdates/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting date", error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Event Schedule</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-medium">Manage conference sessions and important administrative deadlines.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadData}
            className="px-4 py-2 border border-border rounded-md text-foreground font-semibold tracking-wider text-xs uppercase bg-card hover:bg-muted transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={() => { setScheduleForm({}); setEditingScheduleId(null); setShowScheduleModal(true); }}
            className="px-4 py-2 rounded-md bg-[#1d70b8] text-white font-bold tracking-wider text-xs uppercase flex items-center gap-2 hover:bg-[#165a95] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4"/> Add Session
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Program Sessions */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Programm Sessions</h2>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading sessions...</div>
            ) : schedules.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-card border border-dashed border-border p-8 rounded-lg text-center">No sessions scheduled yet.</div>
            ) : (
              schedules.map((session: any) => (
                <div key={session._id} className="bg-card border border-border p-5 rounded-lg flex justify-between items-start shadow-sm hover:border-primary/30 transition-colors group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold tracking-wider">
                        {session.startTime} - {session.endTime}
                      </span>
                      {session.location && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{session.location}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                  </div>
                  <div className="flex flex-col gap-3 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditSchedule(session)} className="text-slate-400 hover:text-primary transition-colors p-1"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteSchedule(session._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right Column: Crucial Deadlines */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Crucial Deadlines</h2>
            <button 
              onClick={() => { setDateForm({}); setEditingDateId(null); setShowDateModal(true); }}
              className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1 border border-border px-3 py-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Date
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading dates...</div>
            ) : dates.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-card border border-dashed border-border p-8 rounded-lg text-center">No crucial deadlines added yet.</div>
            ) : (
              dates.map((dateItem: any) => (
                <div key={dateItem._id} className="bg-card border border-border p-5 rounded-lg flex justify-between items-center shadow-sm hover:border-primary/30 transition-colors group">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-[11px] font-extrabold tracking-widest mb-3 uppercase">
                      {formatDate(dateItem.date)}
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{dateItem.event}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{dateItem.description || dateItem.event}</p>
                  </div>
                  <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditDate(dateItem)} className="text-slate-300 hover:text-primary transition-colors p-1"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDeleteDate(dateItem._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-4">{editingScheduleId ? 'Edit' : 'Add'} Session</h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={scheduleForm['title'] || ''}
                  onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Start Time</label>
                  <input
                    type="text"
                    value={scheduleForm['startTime'] || ''}
                    onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                    placeholder="e.g. 09:00 AM"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">End Time</label>
                  <input
                    type="text"
                    value={scheduleForm['endTime'] || ''}
                    onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                    placeholder="e.g. 10:30 AM"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={scheduleForm['location'] || ''}
                  onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</label>
                <textarea
                  value={scheduleForm['description'] || ''}
                  onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none min-h-[80px]"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 rounded-md bg-muted text-foreground font-semibold text-xs uppercase tracking-wider hover:bg-muted/80 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-4">{editingDateId ? 'Edit' : 'Add'} Crucial Deadline</h3>
            <form onSubmit={handleDateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Event Name</label>
                <input
                  type="text"
                  value={dateForm['event'] || ''}
                  onChange={(e) => setDateForm({...dateForm, event: e.target.value})}
                  placeholder="e.g. Standard Registration"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Date</label>
                <input
                  type="text"
                  value={dateForm['date'] || ''}
                  onChange={(e) => setDateForm({...dateForm, date: e.target.value})}
                  placeholder="e.g. JUN 12, 2026"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description (Subtitle)</label>
                <input
                  type="text"
                  value={dateForm['description'] || ''}
                  onChange={(e) => setDateForm({...dateForm, description: e.target.value})}
                  placeholder="e.g. STANDARD REGISTRATION"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Display Order</label>
                <input
                  type="number"
                  value={dateForm['display_order'] ?? 0}
                  onChange={(e) => setDateForm({...dateForm, display_order: parseInt(e.target.value) || 0})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowDateModal(false)} className="px-4 py-2 rounded-md bg-muted text-foreground font-semibold text-xs uppercase tracking-wider hover:bg-muted/80 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">Save Deadline</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
