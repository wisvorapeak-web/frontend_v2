"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Send, 
  Users, 
  Mail,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Papa from 'papaparse';
import { fetchApi } from "@/lib/api";

export default function BulkEmailDispatch() {
  const [senderName, setSenderName] = useState("Ascendix Summit");
  const [senderEmail, setSenderEmail] = useState("foodagriexpo@ascendixsummits.com");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [recipients, setRecipients] = useState<{name: string, email: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [totalCsvRows, setTotalCsvRows] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseCSV(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseCSV(e.target.files[0]);
    }
  };

  const parseCSV = (file: File) => {
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];
        const validRecipients = parsed.map(row => {
          const emailKey = Object.keys(row).find(k => k.toLowerCase().includes('email'));
          const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'));
          
          return {
            email: emailKey ? row[emailKey] : null,
            name: nameKey ? row[nameKey] : 'Delegate'
          };
        }).filter(r => r.email && r.email.includes('@'));

        setRecipients(validRecipients as {name: string, email: string}[]);
        setTotalCsvRows(parsed.length);
        setPreviewIndex(0);
        setIsUploading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to parse CSV file.");
        setIsUploading(false);
      }
    });
  };

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email\nJohn Doe,john@example.com\nJane Smith,jane@example.com";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_recipients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispatch = async () => {
    if (recipients.length === 0) {
      alert("Please upload a valid CSV file with recipients.");
      return;
    }
    if (!subject || !message) {
      alert("Please enter a subject and message content.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetchApi('/bulk-emails', {
        method: 'POST',
        body: JSON.stringify({
          senderName,
          senderEmail,
          subject,
          message,
          recipients
        })
      });
      alert(`Success! Dispatched emails successfully.`);
      setRecipients([]);
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Error dispatching emails:", error);
      alert(error.message || "Failed to dispatch emails.");
    } finally {
      setIsSending(false);
    }
  };

  const previewName = recipients.length > 0 ? recipients[previewIndex].name : 'Delegate';
  const previewEmail = recipients.length > 0 ? recipients[previewIndex].email : 'recipient@example.com';
  const hasRecipients = recipients.length > 0;
  const isReadyToDispatch = hasRecipients && subject && message;

  const handlePrevPreview = () => {
    if (previewIndex > 0) setPreviewIndex(previewIndex - 1);
  };

  const handleNextPreview = () => {
    if (previewIndex < recipients.length - 1) setPreviewIndex(previewIndex + 1);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-12">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-2">
          Bulk Email Dispatch
        </h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          Send personalized messages to delegates via CSV upload.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center text-lg font-bold text-foreground mb-6 tracking-tight">
              <FileSpreadsheet className="w-5 h-5 mr-3 text-primary/70" />
              1. RECIPIENT LIST
            </h2>
            
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer mb-6",
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              ) : (
                <Upload className="w-10 h-10 text-muted-foreground/50 mb-4" strokeWidth={1.5} />
              )}
              <h3 className="text-base font-bold text-foreground mb-2">
                {isUploading ? "PARSING CSV..." : "SELECT CSV FILE"}
              </h3>
              <p className="text-sm text-muted-foreground uppercase tracking-wide text-xs font-medium">
                Click or drag and drop your recipient list
              </p>
            </div>

            <button onClick={downloadSampleCsv} className="flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide">
              <Download className="w-4 h-4 mr-2" />
              Sample CSV
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center text-lg font-bold text-foreground mb-6 tracking-tight">
              <Mail className="w-5 h-5 mr-3 text-primary/70" />
              2. MESSAGE COMPOSITION
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Sender Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Sender Email</label>
                  <select 
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-shadow appearance-none"
                  >
                    <option value="asfaa-2026@foodagriexpo.com">asfaa-2026@foodagriexpo.com</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Email Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Important Update: ASFAA-2026 Summit"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">Message Content</label>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-md uppercase tracking-wider">
                    Use {`{{name}}`} to insert names
                  </span>
                </div>
                <textarea
                  placeholder="Dear {{name}},&#10;&#10;We are pleased to invite you to the summit..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-shadow min-h-[250px] resize-y"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDispatch}
            disabled={!isReadyToDispatch || isSending}
            className={cn(
              "w-full flex items-center justify-center py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-sm",
              isReadyToDispatch 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "bg-slate-500 text-white opacity-50 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-3" />
            )}
            {isSending ? "Dispatching..." : "Dispatch to Recipients"}
          </button>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Preview
              </h2>
              {hasRecipients && (
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <button onClick={handlePrevPreview} disabled={previewIndex === 0} className="hover:text-foreground disabled:opacity-50">&lt;</button>
                  <span>{previewIndex + 1} OF {recipients.length}</span>
                  <button onClick={handleNextPreview} disabled={previewIndex === recipients.length - 1} className="hover:text-foreground disabled:opacity-50">&gt;</button>
                </div>
              )}
            </div>
            
            <div className="p-5 flex-grow">
              <div className="space-y-2 mb-6 text-sm">
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-0.5">From</span>
                  <span className="font-semibold text-foreground break-all">{senderName} &lt;{senderEmail}&gt;</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-0.5">To</span>
                  <span className="text-foreground text-sm">{previewEmail}</span>
                </div>
                <div className="grid grid-cols-[60px_1fr] gap-2 items-start">
                  <span className="text-xs font-bold text-muted-foreground uppercase mt-0.5">Subject</span>
                  <span className="text-foreground text-sm">{subject || '---'}</span>
                </div>
              </div>

              <div className="bg-muted/10 border border-border/50 rounded-lg p-5 min-h-[200px]">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Dear {previewName},
                </p>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap font-medium leading-relaxed italic">
                  {message ? message.replace(/\{\{name\}\}/g, previewName) : 'Message content preview will appear here...'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h2 className="flex items-center text-sm font-bold text-foreground mb-6 tracking-tight uppercase">
              <Users className="w-4 h-4 mr-3 text-muted-foreground" />
              Quick Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">CSV Rows</span>
                <span className="font-bold text-foreground">{totalCsvRows}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Valid Recipients</span>
                <span className="font-bold text-foreground">{recipients.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Column Mapping</span>
                <span className={cn("font-bold", hasRecipients ? "text-emerald-500" : "text-amber-500")}>
                  {hasRecipients ? "Auto-mapped" : "Needs setup"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Subject Status</span>
                <span className={cn("font-bold", subject ? "text-emerald-500" : "text-muted-foreground")}>
                  {subject ? "Ready" : "Missing"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Sender Identity</span>
                <span className="font-medium text-primary text-xs truncate max-w-[150px]" title={senderEmail}>
                  {senderEmail}
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
