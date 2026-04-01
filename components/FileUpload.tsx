"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
  multiple?: boolean;
}

export default function FileUpload({
  files,
  onFilesChange,
  label = "Upload Files",
  maxSizeMB = 10,
  acceptedTypes = "image/*,application/pdf",
  multiple = true,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAction = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const validFiles = Array.from(newFiles).filter((file) => {
      const isTooLarge = file.size > maxSizeMB * 1024 * 1024;
      if (isTooLarge) alert(`${file.name} exceeds ${maxSizeMB}MB limit.`);
      return !isTooLarge;
    });

    onFilesChange(multiple ? [...files, ...validFiles] : [validFiles[0]]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 w-full">
      <label className="block text-sm font-semibold text-gray-700 ml-1">
        {label}
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileAction(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`
          group relative w-full border-2 border-dashed rounded-[1.5rem] p-8 
          text-center transition-all cursor-pointer flex flex-col items-center justify-center
          ${isDragging 
            ? "border-[#009A74] bg-[#009A74]/5 scale-[1.01]" 
            : "border-gray-200 hover:border-[#009A74] hover:bg-gray-50/50"}
        `}
      >
        <UploadCloud 
          className={`w-12 h-12 mb-3 transition-colors ${isDragging ? "text-[#009A74]" : "text-gray-400 group-hover:text-black"}`} 
        />
        <p className="text-sm font-medium text-gray-600">
          <span className="text-black font-bold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
          {acceptedTypes.replace(/image\/|application\//g, "")} (Max {maxSizeMB}MB)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          className="hidden"
          onChange={(e) => handleFileAction(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Selected files">
          {files.map((file, idx) => (
            <li 
              key={`${file.name}-${idx}`} 
              className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-[#009A74]/10 rounded-lg">
                  <FileText className="w-4 h-4 text-[#009A74]" />
                </div>
                <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}