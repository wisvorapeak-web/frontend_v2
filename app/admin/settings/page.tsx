"use client";

import { useState, useEffect } from "react";
import { Globe, ShieldAlert, Server, Share2, Save } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SettingItem {
  _id?: string;
  key: string;
  value: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Settings State Map
  const [config, setConfig] = useState<{ [key: string]: string }>({
    SITE_NAME: "Wiswora Summit",
    CONTACT_EMAIL: "support@wiswora.com",
    MAINTENANCE_MODE: "false",
    ALLOW_REGISTRATION: "true",
    REQUIRE_EMAIL_VERIFICATION: "false",
    SOCIAL_LINKEDIN: "https://linkedin.com",
    SOCIAL_X: "https://x.com",
    SOCIAL_INSTAGRAM: "https://instagram.com",
    SOCIAL_FACEBOOK: "https://facebook.com",
  });

  const tabs = [
    { id: "general", label: "GENERAL CONFIG", icon: Globe },
    { id: "security", label: "SECURITY & ACCESS", icon: ShieldAlert },
    { id: "maintenance", label: "MAINTENANCE", icon: Server },
    { id: "social", label: "SOCIAL URLS", icon: Share2 },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/settings');
      setSettings(res);
      
      // Map array to object state
      const currentConfig = { ...config };
      res.forEach((item: SettingItem) => {
        if (currentConfig[item.key] !== undefined) {
          currentConfig[item.key] = item.value;
        }
      });
      setConfig(currentConfig);
    } catch (error) {
      console.error("Error loading settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true"
    }));
  };

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ text: "", type: "" });
      
      // Save all keys that exist in our config
      const promises = Object.keys(config).map(async (key) => {
        const existing = settings.find(s => s.key === key);
        const payload = { key, value: config[key] };
        
        if (existing) {
          if (existing.value !== config[key]) {
             await fetchApi(`/settings/${existing._id}`, {
               method: 'PUT',
               body: JSON.stringify(payload)
             });
          }
        } else {
          await fetchApi('/settings', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        }
      });

      await Promise.all(promises);
      await loadSettings();
      setMessage({ text: "Settings saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading Configuration...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-border gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">System Settings</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-medium">Configure global preferences, security, and URLs</p>
        </div>
        <div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-6 py-2 rounded-md bg-[#1d70b8] text-white font-bold tracking-wider text-xs uppercase flex items-center gap-2 hover:bg-[#165a95] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={cn("mb-6 p-4 rounded-lg border", message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}>
          {message.text}
        </div>
      )}

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
        
        {/* GENERAL CONFIGURATION */}
        {activeTab === 'general' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">General Configuration</h3>
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Site Name</label>
                <input
                  type="text"
                  value={config.SITE_NAME}
                  onChange={(e) => handleChange('SITE_NAME', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="e.g. Wiswora Summit"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Support Contact Email</label>
                <input
                  type="email"
                  value={config.CONTACT_EMAIL}
                  onChange={(e) => handleChange('CONTACT_EMAIL', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="support@wiswora.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECURITY & ACCESS */}
        {activeTab === 'security' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">Security & Access</h3>
            <div className="space-y-6 max-w-3xl">
              <ToggleRow 
                title="Allow Public Registration" 
                description="Enable or disable new user registrations." 
                checked={config.ALLOW_REGISTRATION === "true"} 
                onChange={() => handleToggle('ALLOW_REGISTRATION')} 
              />
              <div className="h-px bg-border w-full"></div>
              <ToggleRow 
                title="Require Email Verification" 
                description="Force new users to verify their email address before logging in." 
                checked={config.REQUIRE_EMAIL_VERIFICATION === "true"} 
                onChange={() => handleToggle('REQUIRE_EMAIL_VERIFICATION')} 
              />
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="p-6 relative overflow-hidden bg-rose-500/5">
            <h3 className="text-lg font-bold text-rose-400 mb-6 uppercase tracking-wider">System Maintenance</h3>
            <div className="space-y-6 max-w-3xl">
              <ToggleRow 
                title="Maintenance Mode" 
                description="Take the entire public site offline. Only Super Admins will be able to access the admin panel." 
                checked={config.MAINTENANCE_MODE === "true"} 
                onChange={() => handleToggle('MAINTENANCE_MODE')} 
                danger
              />
            </div>
          </div>
        )}

        {/* SOCIAL URLS */}
        {activeTab === 'social' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-wider">Social Media Links</h3>
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  value={config.SOCIAL_LINKEDIN}
                  onChange={(e) => handleChange('SOCIAL_LINKEDIN', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">X (Twitter) URL</label>
                <input
                  type="text"
                  value={config.SOCIAL_X}
                  onChange={(e) => handleChange('SOCIAL_X', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="https://x.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Instagram URL</label>
                <input
                  type="text"
                  value={config.SOCIAL_INSTAGRAM}
                  onChange={(e) => handleChange('SOCIAL_INSTAGRAM', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Facebook URL</label>
                <input
                  type="text"
                  value={config.SOCIAL_FACEBOOK}
                  onChange={(e) => handleChange('SOCIAL_FACEBOOK', e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:border-primary/50 outline-none" 
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange, danger = false }: { title: string, description: string, checked: boolean, onChange: () => void, danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">{description}</p>
      </div>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? (danger ? "bg-rose-500" : "bg-primary") : "bg-muted"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
