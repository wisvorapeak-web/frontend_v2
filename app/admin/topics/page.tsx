"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Plus } from "lucide-react";
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
      const res = await fetchApi('/topics');
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
        await fetchApi(`/topics/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/topics', {
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
      await fetchApi(`/topics/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const columns = [
    { key: 'title', label: 'Topic Title' },
    { key: 'description', label: 'Description' },
    { key: 'icon_name', label: 'Icon String' },
    { key: 'is_active', label: 'Active', render: (val: any) => val ? 'Yes' : 'No' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(item)} className="text-secondary hover:text-secondary/80">Edit</button>
          <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Topics" 
        description="Manage topics"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Topics', href: '/admin/topics' }]}
        action={
          <button onClick={() => { setFormData({}); setEditingId(null); setShowModal(true); }} className="flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </button>
        }
      />
      
      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchPlaceholder="Search..." />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">{editingId ? 'Edit' : 'Add'} Topics</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={formData['title'] || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Icon String</label>
                <input
                  type="text"
                  value={formData['icon_name'] || ''}
                  onChange={(e) => setFormData({...formData, icon_name: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
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
