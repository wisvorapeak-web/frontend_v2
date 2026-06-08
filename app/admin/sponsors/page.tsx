"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Plus } from "lucide-react";
import { FileUploadButton } from "@/components/admin/FileUploadButton";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/sponsors');
      setData(res);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetchApi(`/sponsors/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/sponsors', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setFormData({});
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error("Error saving data", error);
      alert('Error saving data');
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetchApi(`/sponsors/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };



  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Sponsors" 
        description="Manage sponsors"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Sponsors', href: '/admin/sponsors' }]}
        action={
          <button onClick={() => { setFormData({}); setEditingId(null); setShowModal(true); }} className="flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
        }
      />
      
      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {data.map((item: any) => (
            <div key={item._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-lg flex flex-col">
              {item.websiteUrl ? (
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="aspect-square w-full relative bg-muted flex-shrink-0 p-4 block hover:opacity-80 transition-opacity cursor-pointer">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-800 rounded-lg">No Logo</div>
                  )}
                </a>
              ) : (
                <div className="aspect-square w-full relative bg-muted flex-shrink-0 p-4">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-800 rounded-lg">No Logo</div>
                  )}
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">{item.name}</h3>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">{item.tier}</span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{item.description}</p>
                <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-border">
                  {item.websiteUrl && (
                    <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 font-medium mr-auto">Visit</a>
                  )}
                  <button onClick={() => handleEdit(item)} className="text-sm text-secondary hover:text-secondary/80 font-medium">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-sm text-red-400 hover:text-red-300 font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground bg-card rounded-xl border border-border">
              No records found.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">{editingId ? 'Edit' : 'Add'} Sponsors</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Sponsor Name</label>
                <input
                  type="text"
                  value={formData['name'] || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tier</label>
                <select
                  value={formData['tier'] || 'Silver'}
                  onChange={(e) => setFormData({...formData, tier: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                >
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Logo URL</label>
                <div className="flex gap-2 w-full">
                  <input
                  type="text"
                  value={formData['logoUrl'] || ''}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
                  <FileUploadButton accept="image/*" onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData['websiteUrl'] || ''}
                  onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={formData['description'] || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-primary/5 text-foreground hover:bg-primary/10 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
