import React, { useState } from 'react';
import { X, MapPin, Paperclip, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';
import { dispatchService } from '../../services/api';
import logoUrl from '../../assets/logo.png';

interface SpecialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecialRequestModal: React.FC<SpecialRequestModalProps> = ({ isOpen, onClose }) => {
  const [vendorName, setVendorName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [mapInfo, setMapInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleOpenGoogleMaps = () => {
    if (!location.trim()) {
      setMapInfo('Pehle Location field mein area ya address type karein.');
      return;
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    setMapInfo('Google Maps mein location search khol di hai.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newFiles = selected.filter(
        (f) => !attachedFiles.some((existing) => existing.name === f.name && existing.size === f.size)
      );
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!vendorName.trim() || !location.trim() || !contactNumber.trim() || !itemName.trim() || !deadlineDate) {
      setErrorMsg('Kripya sabhi required fields fill karein.');
      return;
    }

    if (!/^\d{10}$/.test(contactNumber.trim())) {
      setErrorMsg('Contact number exact 10 digits ka hona chahiye.');
      return;
    }

    setIsSubmitting(true);

    try {
      dispatchService.addSpecialRequest({
        vendorName: vendorName.trim(),
        location: location.trim(),
        contactNumber: contactNumber.trim(),
        itemName: itemName.trim(),
        deadlineDate,
        feedback: feedback.trim(),
        attachments: attachedFiles.map((f) => f.name),
      });

      setSuccessMsg('Special Work Request successfully submit ho gaya hai!');
      setTimeout(() => {
        setIsSubmitting(false);
        setVendorName('');
        setLocation('');
        setContactNumber('');
        setItemName('');
        setDeadlineDate('');
        setFeedback('');
        setAttachedFiles([]);
        setMapInfo('');
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#181309] to-[#2d2516] p-5 text-white flex items-center justify-between border-b border-[#382f1b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-xs shrink-0">
              <img src={logoUrl} alt="Deepak Brand Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Special Work Request Form</span>
              </h2>
              <p className="text-[11px] text-[#cca352] font-semibold tracking-wide">
                Warehouse & Supply Chain Logistics Request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Warehouse Details Title */}
          <div className="pb-1 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Warehouse & Order Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vendor Name */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Vendor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Vendor ka naam"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digit number"
                maxLength={10}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium font-mono focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white"
              />
            </div>
          </div>

          {/* Location & Map */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City / Area"
                required
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>📍 Add Location</span>
              </button>
            </div>
            {mapInfo && <p className="text-[11px] text-blue-600 mt-1 font-medium">{mapInfo}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Item Name */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item ka naam"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white"
              />
            </div>

            {/* Deadline Date */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Deadline Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white"
              />
            </div>
          </div>

          {/* Feedback / Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Feedback / Notes</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Apna feedback ya requirement note likho..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400] focus:bg-white resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Attachments</label>
            <input
              id="fileInputModal"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('fileInputModal')?.click()}
              className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Paperclip className="w-4 h-4 text-slate-500" />
              <span>📎 File Add Karo</span>
            </button>

            {attachedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachedFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-rose-500 hover:text-rose-700 font-bold px-1.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#F4B400] hover:bg-[#d99f00] text-[#181309] font-bold rounded-lg shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
