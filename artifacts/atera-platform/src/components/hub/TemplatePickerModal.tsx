import { useState } from "react";
import { X, Search } from "lucide-react";
import { templates } from "@/lib/templates";

interface TemplatePickerModalProps {
  open: boolean;
  onClose: () => void;
  audience: "guest" | "landlord";
  onSelect: (body: string) => void;
}

export function TemplatePickerModal({ open, onClose, audience, onSelect }: TemplatePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!open) return null;

  const filteredTemplates = templates
    .filter(t => t.audience === audience || t.audience === "both")
    .filter(t => t.label.toLowerCase().includes(searchTerm.toLowerCase()) || t.type.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-[#0D0C0F] border border-[rgba(201,168,76,0.15)] max-h-[85vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgba(201,168,76,0.12)] shrink-0">
          <h3 className="font-display text-xl text-gold">Select a Template</h3>
          <button onClick={onClose} className="text-grey-1 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[rgba(201,168,76,0.12)] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-grey-1" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#131217] border border-border-light text-white pl-9 pr-3 py-2 text-sm focus:border-gold outline-none transition-colors" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="text-center text-grey-1 py-8 text-sm">No templates found.</div>
          ) : (
            filteredTemplates.map(t => (
              <button 
                key={t.id}
                onClick={() => onSelect(t.body)}
                className="text-left bg-[#131217] border border-[rgba(201,168,76,0.1)] p-4 hover:border-gold/40 transition-colors group flex flex-col gap-2"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="font-body font-medium text-off-white text-sm group-hover:text-gold transition-colors">{t.label}</div>
                  <div className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm">
                    {t.type}
                  </div>
                </div>
                <div className="text-xs text-grey-1 line-clamp-2 leading-relaxed">
                  {t.body}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
