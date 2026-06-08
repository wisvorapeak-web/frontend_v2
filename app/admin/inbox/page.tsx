"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Search, Star, Trash2, CornerUpLeft, CheckCircle2, User } from "lucide-react";

export default function InboxPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"INBOX" | "ARCHIVE">("INBOX");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/inboxs');
      setData(res);
      if (res && res.length > 0 && !selectedId) {
        setSelectedId(res[0]._id);
      }
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inbox item?')) return;
    try {
      await fetchApi(`/inboxs/${id}`, { method: 'DELETE' });
      const newData = data.filter(d => d._id !== id);
      setData(newData);
      if (selectedId === id) {
        setSelectedId(newData.length > 0 ? newData[0]._id : null);
      }
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/inboxs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      // update local state
      setData(data.map(d => d._id === id ? { ...d, status } : d));
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const filteredData = data.filter(item => {
    // Basic search
    const q = search.toLowerCase();
    const name = (item.name || item.sender || "").toLowerCase();
    const subject = (item.subject || "").toLowerCase();
    const matchesSearch = name.includes(q) || subject.includes(q);

    // Simple view filter (assume 'Resolved' goes to archive, or use a specific property)
    if (view === "INBOX") {
      return matchesSearch && item.status !== "Resolved";
    } else {
      return matchesSearch && item.status === "Resolved";
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const selectedMessage = data.find(d => d._id === selectedId);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) + ", " + 
           d.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-border bg-card flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Inbox</h1>
        </div>
        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setView("INBOX")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${view === "INBOX" ? "bg-white text-[#1d70b8] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Inbox
          </button>
          <button 
            onClick={() => setView("ARCHIVE")}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${view === "ARCHIVE" ? "bg-white text-[#1d70b8] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Archive
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left List Pane */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] flex flex-col border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search inquiries..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading messages...</div>
            ) : filteredData.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">No messages found.</div>
            ) : (
              filteredData.map(item => {
                const isSelected = selectedId === item._id;
                const name = item.name || item.sender || "Unknown";
                
                return (
                  <div 
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`p-5 border-b border-border cursor-pointer transition-colors relative ${isSelected ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1d70b8]" />
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm uppercase tracking-wide text-foreground">{name}</h4>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="font-semibold text-xs text-foreground mb-1.5 uppercase tracking-wide">
                      {item.subject || "No Subject"}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 uppercase tracking-wide font-medium leading-relaxed mb-3">
                      {item.subject?.toLowerCase().includes('brochure') 
                        ? `Visitor requested brochure access. Country: ${item.country || 'N/A'}. Phone: ${item.phone || 'N/A'}` 
                        : (item.message || "No content")}
                    </p>
                    <div className="inline-block px-2.5 py-1 bg-muted rounded border border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {item.subject?.toLowerCase().includes('brochure') ? 'brochure' : 'contact'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
          {selectedMessage ? (
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="p-8 pb-4">
                {/* Contact Header */}
                <div className="flex items-start justify-between border-b border-border pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#d67a42] flex items-center justify-center text-white border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                      {/* Avatar placeholder */}
                      <User className="w-8 h-8 opacity-80" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold uppercase tracking-wider text-foreground mb-1">
                        {selectedMessage.name || selectedMessage.sender || "Unknown User"}
                      </h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {selectedMessage.email || "NO EMAIL PROVIDED"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="w-10 h-10 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-[#e6f4f9] text-[#1d70b8] border border-[#bae0ee] rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Message Details
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Received: {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                <h1 className="text-2xl font-black uppercase tracking-wider text-foreground mb-8">
                  {selectedMessage.subject || "No Subject"}
                </h1>

                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  {selectedMessage.subject?.toLowerCase().includes('brochure') ? (
                    <>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-8">
                        This user has requested to download the event brochure.
                      </p>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Country</p>
                          <p className="text-sm font-bold uppercase text-foreground">{selectedMessage.country || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Phone Number</p>
                          <p className="text-sm font-bold uppercase text-foreground">{selectedMessage.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Message Content</p>
                      <div className="text-sm text-foreground font-medium leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message || "No content provided."}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mt-8 border-t border-border pt-8">
                        {selectedMessage.country && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Country</p>
                            <p className="text-sm font-bold uppercase text-foreground">{selectedMessage.country}</p>
                          </div>
                        )}
                        {selectedMessage.phone && (
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Phone Number</p>
                            <p className="text-sm font-bold uppercase text-foreground">{selectedMessage.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-auto p-8 border-t border-border bg-card/50 flex items-center justify-between gap-4">
                <button 
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'Unread')} // Or custom Follow up status
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1d70b8] hover:bg-[#165a95] text-white py-4 rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <CornerUpLeft className="w-4 h-4" />
                  Mark For Follow-Up
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'Resolved')}
                  className={`flex-1 flex items-center justify-center gap-2 border py-4 rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-sm
                    ${selectedMessage.status === 'Resolved' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-border text-muted-foreground hover:bg-muted'}`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${selectedMessage.status === 'Resolved' ? 'text-green-600' : 'text-[#38b2ac]'}`} />
                  {selectedMessage.status === 'Resolved' ? 'Resolved' : 'Mark As Resolved'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-2">No Message Selected</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Select an inquiry from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
