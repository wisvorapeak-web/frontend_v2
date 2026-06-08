"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, X } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function PricingPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({
    features: [],
    is_active: true,
    is_popular: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/pricings');
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
        await fetchApi(`/pricings/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/pricings', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setFormData({ features: [], is_active: true, is_popular: false });
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error("Error saving data", error);
      alert('Error saving data');
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      ...item,
      features: item.features || []
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing tier?')) return;
    try {
      await fetchApi(`/pricings/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      setFormData({
        ...formData,
        features: [...(formData.features || []), e.currentTarget.value]
      });
      e.currentTarget.value = '';
    }
  };

  const handleFeatureRemove = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'amount', 
      label: 'Price',
      render: (_: any, item: any) => `${item.currency}${item.amount}` 
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs ${val ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, item: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(item)} className="text-secondary hover:text-secondary/80 text-sm">Edit</button>
          <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Pricing Tiers" 
        description="Manage accommodation, registration, and sponsorship packages."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pricing', href: '/admin/pricing' }]}
        action={
          <button onClick={() => { setFormData({ features: [], is_active: true, is_popular: false }); setEditingId(null); setShowModal(true); }} className="flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Add Package
          </button>
        }
      />
      
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} searchPlaceholder="Search packages..." />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl shadow-2xl my-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">{editingId ? 'Edit' : 'Add'} Pricing Package</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Package Name</label>
                  <input
                    type="text"
                    value={formData['name'] || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={formData['category'] || ''}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Registration">Registration</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData['amount'] || ''}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={formData['currency'] || '$'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={formData['description'] || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Features (Press Enter to add)</label>
                <div className="p-3 border border-border rounded-md bg-background/50 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((feature: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {feature}
                        <button type="button" onClick={() => handleFeatureRemove(idx)} className="ml-1.5 text-primary hover:text-primary/70">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a feature..."
                    onKeyDown={handleFeatureAdd}
                    className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData['is_popular'] || false}
                    onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background"
                  />
                  <span className="text-sm font-medium text-foreground">Mark as Popular / Featured</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData['is_active'] ?? true}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background"
                  />
                  <span className="text-sm font-medium text-foreground">Active (Visible)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-primary/5 text-foreground hover:bg-primary/10 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
