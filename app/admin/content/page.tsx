"use client";

import { useState, useEffect } from "react";
import { Plus, LayoutTemplate, Info, MessageSquare, Star, Edit2, Trash2, Save } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States for Hero & About
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', dateText: '', locationText: '', bgImage: '' });
  const [aboutForm, setAboutForm] = useState({ title: '', content: '' });

  // States for FAQs & Testimonials
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Modal States
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqForm, setFaqForm] = useState<any>({});
  
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<any>({});

  const tabs = [
    { id: "hero", label: "HERO SECTION", icon: LayoutTemplate },
    { id: "about", label: "ABOUT PAGE", icon: Info },
    { id: "faqs", label: "FAQS", icon: MessageSquare },
    { id: "testimonials", label: "TESTIMONIALS", icon: Star },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [heroRes, aboutRes, faqsRes, testRes] = await Promise.all([
        fetchApi('/sitecontent/hero'),
        fetchApi('/sitecontent/about'),
        fetchApi('/faqs'),
        fetchApi('/testimonials')
      ]);

      if (heroRes?.data) setHeroForm(heroRes.data);
      if (aboutRes?.data) setAboutForm(aboutRes.data);
      setFaqs(faqsRes || []);
      setTestimonials(testRes || []);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  // ----- HERO & ABOUT HANDLERS -----
  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await fetchApi('/sitecontent/hero', {
        method: 'PUT',
        body: JSON.stringify({ data: heroForm })
      });
      alert('Hero section saved successfully');
    } catch (error) {
      alert('Failed to save Hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      await fetchApi('/sitecontent/about', {
        method: 'PUT',
        body: JSON.stringify({ data: aboutForm })
      });
      alert('About page saved successfully');
    } catch (error) {
      alert('Failed to save About page');
    } finally {
      setSaving(false);
    }
  };

  // ----- FAQ HANDLERS -----
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (faqForm._id) {
        await fetchApi(`/faqs/${faqForm._id}`, { method: 'PUT', body: JSON.stringify(faqForm) });
      } else {
        await fetchApi('/faqs', { method: 'POST', body: JSON.stringify(faqForm) });
      }
      setShowFaqModal(false);
      loadData();
    } catch (error) {
      alert('Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await fetchApi(`/faqs/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  // ----- TESTIMONIAL HANDLERS -----
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (testimonialForm._id) {
        await fetchApi(`/testimonials/${testimonialForm._id}`, { method: 'PUT', body: JSON.stringify(testimonialForm) });
      } else {
        await fetchApi('/testimonials', { method: 'POST', body: JSON.stringify(testimonialForm) });
      }
      setShowTestimonialModal(false);
      loadData();
    } catch (error) {
      alert('Failed to save testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await fetchApi(`/testimonials/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Site Content</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-medium">Manage site text and images</p>
        </div>
        <div>
          {activeTab === 'faqs' && (
            <button onClick={() => { setFaqForm({ isActive: true, order: 0 }); setShowFaqModal(true); }} className="px-4 py-2 rounded-md bg-[#1d70b8] text-white font-bold tracking-wider text-xs uppercase flex items-center gap-2 hover:bg-[#165a95] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          )}
          {activeTab === 'testimonials' && (
            <button onClick={() => { setTestimonialForm({ isActive: true, rating: 5 }); setShowTestimonialModal(true); }} className="px-4 py-2 rounded-md bg-[#1d70b8] text-white font-bold tracking-wider text-xs uppercase flex items-center gap-2 hover:bg-[#165a95] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-card border border-border p-2 rounded-lg inline-flex w-full overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden min-h-[400px]">
        
        {/* HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">Hero Section Details</h3>
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Main Title</label>
                <input type="text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" placeholder="e.g. ASFAA-2026" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Subtitle</label>
                <textarea value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none min-h-[80px]" placeholder="Led by the future of sustainable food systems..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Event Dates Text</label>
                  <input type="text" value={heroForm.dateText} onChange={e => setHeroForm({...heroForm, dateText: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" placeholder="November 18-20, 2026" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Location Text</label>
                  <input type="text" value={heroForm.locationText} onChange={e => setHeroForm({...heroForm, locationText: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" placeholder="Singapore" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Background Image URL</label>
                <input type="text" value={heroForm.bgImage} onChange={e => setHeroForm({...heroForm, bgImage: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" placeholder="/hero.png" />
              </div>
              <div className="pt-4">
                <button onClick={handleSaveHero} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-primary/90">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT PAGE */}
        {activeTab === 'about' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">About Page Content</h3>
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">About Section Title</label>
                <input type="text" value={aboutForm.title} onChange={e => setAboutForm({...aboutForm, title: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" placeholder="About The Summit" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Main Content</label>
                <textarea value={aboutForm.content} onChange={e => setAboutForm({...aboutForm, content: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none min-h-[300px]" placeholder="Write your about page content here..." />
              </div>
              <div className="pt-4">
                <button onClick={handleSaveAbout} disabled={saving} className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-primary/90">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQS TABLE */}
        {activeTab === 'faqs' && (
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-muted/30">
              <div className="col-span-8 text-xs font-bold tracking-wider text-muted-foreground uppercase">Question</div>
              <div className="col-span-2 text-xs font-bold tracking-wider text-muted-foreground uppercase text-center">Order</div>
              <div className="col-span-2 text-xs font-bold tracking-wider text-muted-foreground uppercase text-right">Actions</div>
            </div>
            {faqs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <p className="text-sm font-bold tracking-widest text-slate-300 uppercase italic">No items found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {faqs.map((f: any) => (
                  <div key={f._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors">
                    <div className="col-span-8">
                      <p className="font-semibold text-sm text-foreground">{f.question}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{f.answer}</p>
                    </div>
                    <div className="col-span-2 text-center text-sm font-medium">{f.order}</div>
                    <div className="col-span-2 flex justify-end gap-3">
                      <button onClick={() => { setFaqForm(f); setShowFaqModal(true); }} className="text-slate-400 hover:text-primary"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteFaq(f._id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS TABLE */}
        {activeTab === 'testimonials' && (
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-muted/30">
              <div className="col-span-8 text-xs font-bold tracking-wider text-muted-foreground uppercase">Author</div>
              <div className="col-span-2 text-xs font-bold tracking-wider text-muted-foreground uppercase text-center">Rating</div>
              <div className="col-span-2 text-xs font-bold tracking-wider text-muted-foreground uppercase text-right">Actions</div>
            </div>
            {testimonials.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <p className="text-sm font-bold tracking-widest text-slate-300 uppercase italic">No items found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {testimonials.map((t: any) => (
                  <div key={t._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/10 transition-colors">
                    <div className="col-span-8">
                      <p className="font-semibold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.role} at {t.company}</p>
                    </div>
                    <div className="col-span-2 text-center text-sm font-medium">{t.rating}/5</div>
                    <div className="col-span-2 flex justify-end gap-3">
                      <button onClick={() => { setTestimonialForm(t); setShowTestimonialModal(true); }} className="text-slate-400 hover:text-primary"><Edit2 className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteTestimonial(t._id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold tracking-widest uppercase text-foreground mb-4">{faqForm._id ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Question</label>
                <input type="text" required value={faqForm.question || ''} onChange={e => setFaqForm({...faqForm, question: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Answer</label>
                <textarea required value={faqForm.answer || ''} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none min-h-[100px]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Order</label>
                <input type="number" value={faqForm.order || 0} onChange={e => setFaqForm({...faqForm, order: Number(e.target.value)})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowFaqModal(false)} className="px-4 py-2 rounded-md bg-muted text-foreground font-semibold text-xs uppercase tracking-wider">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold tracking-widest uppercase text-foreground mb-4">{testimonialForm._id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Author Name</label>
                <input type="text" required value={testimonialForm.name || ''} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Role</label>
                  <input type="text" required value={testimonialForm.role || ''} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Company</label>
                  <input type="text" required value={testimonialForm.company || ''} onChange={e => setTestimonialForm({...testimonialForm, company: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Quote</label>
                <textarea required value={testimonialForm.quote || ''} onChange={e => setTestimonialForm({...testimonialForm, quote: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Avatar URL</label>
                  <input type="text" value={testimonialForm.avatar || ''} onChange={e => setTestimonialForm({...testimonialForm, avatar: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={testimonialForm.rating || 5} onChange={e => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowTestimonialModal(false)} className="px-4 py-2 rounded-md bg-muted text-foreground font-semibold text-xs uppercase tracking-wider">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
