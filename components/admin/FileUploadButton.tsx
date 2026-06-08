import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';

interface FileUploadButtonProps {
  label?: string;
  onUploadSuccess: (url: string) => void;
  accept?: string;
  className?: string;
}

export function FileUploadButton({ label, onUploadSuccess, accept, className }: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      
      const token = Cookies.get('admin_token');

      // We use the full URL to the backend or a relative proxy path if configured
      // Assuming backend is on port 5000 based on standard setup
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onUploadSuccess(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn(label ? "space-y-2" : "", className)}>
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary/10 text-primary hover:bg-primary/20 h-9 px-4 py-2 border border-primary/20 shadow-sm">
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Choose File'}
          <input 
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleUpload} 
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
