"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/registrations');
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
        await fetchApi(`/registrations/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/registrations', {
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
    if (!confirm('Are you sure you want to delete this registration?')) return;
    try {
      await fetchApi(`/registrations/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const columns = [
    { key: 'name', label: 'Attendee Name' },
    { key: 'email', label: 'Email' },
    { key: 'package_name', label: 'Base Package' },
    { 
      key: 'total_amount', 
      label: 'Total Amount',
      render: (val: number) => `$${val || 0}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(item)} className="text-secondary hover:text-secondary/80 text-sm">Review</button>
          <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Registrations" 
        description="Review incoming attendee registrations and payments."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Registrations', href: '/admin/registrations' }]}
      />
      
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchPlaceholder="Search attendees..." />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl shadow-2xl my-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">Review Registration</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData['name'] || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData['email'] || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Organization</label>
                <input
                  type="text"
                  value={formData['organization'] || ''}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Base Package</label>
                  <input
                    type="text"
                    value={formData['package_name'] || ''}
                    onChange={(e) => setFormData({...formData, package_name: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Accommodation Add-on</label>
                  <input
                    type="text"
                    value={formData['accommodation_name'] || 'None'}
                    onChange={(e) => setFormData({...formData, accommodation_name: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Accompanying Guests</label>
                  <input
                    type="number"
                    value={formData['accompanying_guests'] || 0}
                    onChange={(e) => setFormData({...formData, accompanying_guests: Number(e.target.value)})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Amount ($)</label>
                  <input
                    type="number"
                    value={formData['total_amount'] || 0}
                    onChange={(e) => setFormData({...formData, total_amount: Number(e.target.value)})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-foreground mb-1">Payment Status</label>
                <select
                  value={formData['status'] || 'Pending'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-primary/5 text-foreground hover:bg-primary/10 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
