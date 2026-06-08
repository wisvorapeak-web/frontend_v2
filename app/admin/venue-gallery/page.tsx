"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { FileUploadButton } from "@/components/admin/FileUploadButton";
import { fetchApi } from "@/lib/api";

export default function Page() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/venue-galleries');
      setGalleryImages(res);
    } catch (error) {
      console.error("Error loading gallery", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    try {
      await fetchApi('/venue-galleries', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: newImageUrl.trim() })
      });
      setShowModal(false);
      setNewImageUrl("");
      loadGallery();
    } catch (error) {
      console.error("Error adding image", error);
      alert('Error adding image');
    }
  };

  const handleDeleteImage = async (galleryId: string) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;
    try {
      await fetchApi(`/venue-galleries/${galleryId}`, { method: 'DELETE' });
      loadGallery();
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Venue Gallery" 
        description="Manage the photo gallery for your venue"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Venue Gallery', href: '/admin/venue-gallery' }]}
        action={
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </button>
        }
      />
      
      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse mt-8">Loading gallery...</div>
      ) : (
        <div className="mt-8">
          {galleryImages.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-card border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3">
              <ImageIcon size={48} className="opacity-20" />
              <p>No images in the gallery yet.</p>
              <button onClick={() => setShowModal(true)} className="text-primary hover:underline text-sm font-medium">Add your first image</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((img) => (
                <div key={img._id} className="group relative aspect-video bg-muted rounded-xl border border-border overflow-hidden shadow-sm">
                  <img src={img.imageUrl} alt="Gallery item" className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleDeleteImage(img._id)}
                      className="p-3 bg-red-500/90 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-lg"
                      title="Remove Image"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Add Gallery Image</h3>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Image URL *</label>
                <div className="flex gap-2 w-full">
                  <input 
                    type="url" 
                    value={newImageUrl} 
                    onChange={(e) => setNewImageUrl(e.target.value)} 
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    required 
                    placeholder="https://example.com/image.jpg" 
                  />
                  <FileUploadButton accept="image/*" onUploadSuccess={(url) => setNewImageUrl(url)} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">Add to Gallery</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
