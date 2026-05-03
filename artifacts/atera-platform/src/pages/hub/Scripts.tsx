import { useState } from "react";
import { ChevronDown, Clipboard, Check } from "lucide-react";
import { templates, callScripts, objections } from "@/lib/templates";

export function HubScripts() {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const guestTemplates = templates.filter(t => t.audience === "guest");
  const landlordTemplates = templates.filter(t => t.audience === "landlord");

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const renderTemplateSection = (items: typeof templates, title: string) => (
    <div className="flex flex-col gap-3">
      <h3 className="font-body font-medium text-off-white mb-2">{title}</h3>
      {items.map(t => (
        <div key={t.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-hidden">
          <button 
            className="w-full p-4 flex justify-between items-center hover:bg-[rgba(201,168,76,0.02)] transition-colors"
            onClick={() => setExpandedTemplate(expandedTemplate === t.id ? null : t.id)}
          >
            <div className="flex items-center gap-3">
              <span className="font-body font-medium text-off-white text-sm">{t.label}</span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[rgba(255,255,255,0.1)] text-grey-1 bg-[rgba(255,255,255,0.05)] rounded-sm">
                {t.type}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-grey-1 transition-transform duration-300 ${expandedTemplate === t.id ? "rotate-180" : ""}`} />
          </button>
          
          <div className={`transition-all duration-300 ease-in-out ${expandedTemplate === t.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
            <div className="p-4 pt-0 border-t border-[rgba(201,168,76,0.05)] bg-[#0D0C0F] relative group">
              <pre className="font-body font-light text-grey-1 text-[15px] whitespace-pre-wrap leading-relaxed mt-4">
                {t.body}
              </pre>
              <button 
                onClick={(e) => { e.stopPropagation(); handleCopy(t.body, t.id); }}
                className="absolute top-4 right-4 p-2 bg-[#131217] border border-gold/30 text-gold hover:bg-gold hover:text-black transition-colors rounded-sm flex items-center gap-2 text-xs"
              >
                {copiedId === t.id ? <><Check className="w-3 h-3" /> Copied!</> : <><Clipboard className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-12">
      <div className="flex justify-between items-end">
        <h2 className="font-display text-3xl text-off-white">Scripts & Templates</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-2xl text-gold border-b border-gold/20 pb-2">Guest Templates</h2>
          {renderTemplateSection(guestTemplates.filter(t => t.type === 'email'), "Email Templates")}
          {renderTemplateSection(guestTemplates.filter(t => t.type === 'sms'), "SMS Templates")}
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="font-display text-2xl text-gold border-b border-gold/20 pb-2">Landlord Templates</h2>
          {renderTemplateSection(landlordTemplates.filter(t => t.type === 'email'), "Email Templates")}
          {renderTemplateSection(landlordTemplates.filter(t => t.type === 'sms'), "SMS Templates")}
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.12)] pt-10">
        <h2 className="font-display text-2xl text-gold border-b border-gold/20 pb-2 mb-6">Call Scripts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {callScripts.map(script => (
            <div key={script.id} className="bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-hidden">
              <button 
                className="w-full p-4 flex justify-between items-center hover:bg-[rgba(201,168,76,0.02)] transition-colors"
                onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
              >
                <span className="font-body font-medium text-off-white">{script.label}</span>
                <ChevronDown className={`w-4 h-4 text-grey-1 transition-transform duration-300 ${expandedScript === script.id ? "rotate-180" : ""}`} />
              </button>
              <div className={`transition-all duration-300 ease-in-out ${expandedScript === script.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="p-6 border-t border-[rgba(201,168,76,0.05)] bg-[#0D0C0F]">
                  <pre className="font-body font-light text-grey-1 text-[15px] whitespace-pre-wrap leading-relaxed">
                    {script.body}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.12)] pt-10">
        <h2 className="font-display text-2xl text-gold border-b border-gold/20 pb-2 mb-6">Objection Handling Reference</h2>
        <div className="bg-[#131217] border border-[rgba(201,168,76,0.1)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.1)]">
                <th className="p-4 label-style text-gold font-medium w-1/4">Objection</th>
                <th className="p-4 label-style text-grey-1 font-medium w-1/2">Response Framework</th>
                <th className="p-4 label-style text-grey-1 font-medium w-1/4">Next Step</th>
              </tr>
            </thead>
            <tbody>
              {objections.map((obj, i) => (
                <tr key={i} className="border-b border-[rgba(201,168,76,0.05)] hover:bg-[#080709] transition-colors">
                  <td className="p-4 font-body font-medium text-off-white text-sm align-top">{obj.objection}</td>
                  <td className="p-4 text-sm text-grey-1 font-light leading-relaxed align-top">"{obj.response}"</td>
                  <td className="p-4 text-xs text-gold/80 align-top">{obj.nextStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
