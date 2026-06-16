"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Plus, Copy, Check } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({ currency: 'USD', is_active: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/custom-payment-links');
      setData(res);
      const plans = await fetchApi('/pricings');
      setPricingPlans(plans);
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
        await fetchApi(`/custom-payment-links/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/custom-payment-links', {
          method: 'POST',
          body: JSON.stringify({ ...formData, publicLinkUrl: `${window.location.origin}/pay` })
        });
      }
      setShowModal(false);
      setFormData({ currency: 'USD', is_active: true });
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
    if (!confirm('Are you sure you want to delete this payment link?')) return;
    try {
      await fetchApi(`/custom-payment-links/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Custom Payment Links" 
        description="Generate and manage custom payment links"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payment Links', href: '/admin/payment-links' }]}
        action={
          <button onClick={() => { setFormData({ currency: 'USD', is_active: true }); setEditingId(null); setShowModal(true); }} className="flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Create Link
          </button>
        }
      />
      
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {data.map((item: any) => (
            <div key={item._id} className={`bg-card border border-border rounded-xl overflow-hidden shadow-lg flex flex-col ${!item.is_active ? 'opacity-60' : ''}`}>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-foreground truncate" title={item.title}>{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">{item.amount}</span>
                  <span className="text-sm text-muted-foreground mb-1 font-medium">{item.currency}</span>
                </div>
                
                {item.description && (
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
                )}

                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => copyLink(item._id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium border border-primary/20"
                  >
                    {copiedId === item._id ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Payment Link</>}
                  </button>

                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button onClick={() => handleEdit(item)} className="text-sm text-secondary hover:text-secondary/80 font-medium">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-sm text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-2">
              <Plus size={32} className="text-muted-foreground/50 mb-2" />
              <p>No payment links created yet.</p>
              <button onClick={() => { setFormData({ currency: 'USD', is_active: true }); setEditingId(null); setShowModal(true); }} className="text-primary hover:underline mt-1">Create your first link</button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-foreground mb-4">{editingId ? 'Edit' : 'Create'} Payment Link</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Use an existing Pricing Plan as a template</label>
                <select
                  onChange={(e) => {
                    const plan = pricingPlans.find(p => p._id === e.target.value);
                    if (plan) {
                      let currencyStr = 'USD';
                      if (plan.currency === '₹' || plan.currency === 'INR') currencyStr = 'INR';
                      setFormData({
                        ...formData,
                        title: plan.name,
                        description: plan.description || '',
                        amount: plan.amount || 0,
                        currency: currencyStr
                      });
                    }
                  }}
                  className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-foreground focus:border-primary/50 focus:outline-none mb-2"
                >
                  <option value="">-- Start from scratch --</option>
                  {pricingPlans.map(plan => (
                    <option key={plan._id} value={plan._id}>{plan.name} ({plan.currency}{plan.amount})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title (What is this for?)</label>
                <input
                  type="text"
                  value={formData['title'] || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  required
                  placeholder="e.g. VIP Dinner Ticket"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={formData['description'] || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none resize-none h-20"
                  placeholder="Add any extra details..."
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Send to Email (Optional)</label>
                  <input
                    type="email"
                    value={formData['email'] || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    placeholder="client@example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">If provided, the payment link will be automatically emailed to this address.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData['amount'] || ''}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    required
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={formData['currency'] || 'USD'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    required
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center mt-6 py-2">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData['is_active'] !== false}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-border bg-background w-4 h-4 accent-primary"
                  />
                  Link is Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-primary/5 text-foreground hover:bg-primary/10 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
