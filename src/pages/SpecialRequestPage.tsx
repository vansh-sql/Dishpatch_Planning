import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  FileText,
  Clock,
  CheckCircle,
  Building2,
  Phone,
  MapPin,
  Paperclip,
  PlusCircle,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { SpecialRequest } from '../types';

interface SpecialRequestPageProps {
  onOpenNewSpecialRequest?: () => void;
}

export const SpecialRequestPage: React.FC<SpecialRequestPageProps> = ({ onOpenNewSpecialRequest }) => {
  const [requests, setRequests] = useState<SpecialRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const loadData = () => {
      setRequests(dispatchService.getSpecialRequests());
    };
    loadData();
    const unsub = dispatchService.subscribe(loadData);
    return () => unsub();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesSearch =
      req.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactNumber.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const completedCount = requests.filter((r) => r.status === 'WORK_DONE').length;

  const handleToggleWorkDone = (req: SpecialRequest) => {
    const newStatus = req.status === 'WORK_DONE' ? 'PENDING' : 'WORK_DONE';
    dispatchService.updateSpecialRequestStatus(req.id, newStatus);
  };

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Vendor Name',
      'Location',
      'Contact Number',
      'Item Name',
      'Deadline Date',
      'Feedback',
      'Attachments',
      'Status',
      'Submitted At',
      'Work Done At',
    ];

    const rows = filteredRequests.map((r) => [
      r.requestId,
      `"${r.vendorName}"`,
      `"${r.location}"`,
      r.contactNumber,
      `"${r.itemName}"`,
      r.deadlineDate,
      `"${r.feedback || ''}"`,
      `"${(r.attachments || []).join('; ')}"`,
      r.status,
      r.submittedAt,
      r.workDoneAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Special_Requests_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Special Work Request Management
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-200">
              {pendingCount} Pending Requests
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor supply chain web form requests, warehouse vendor dispatches, and track completion status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenNewSpecialRequest && (
            <button
              onClick={onOpenNewSpecialRequest}
              className="px-3.5 py-2 bg-[#F4B400] hover:bg-[#d99f00] text-[#181309] text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Special Work Request</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Total Special Requests
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
              {requests.length} Requests
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-amber-400">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Pending Action
            </span>
            <span className="text-base font-extrabold text-amber-700 mt-0.5 block">
              {pendingCount} Pending
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Work Completed
            </span>
            <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">
              {completedCount} Work Done
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, location, item or contact number..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#F4B400]"
          >
            <option value="ALL">All Request Statuses ({requests.length})</option>
            <option value="PENDING">Pending Work ({pendingCount})</option>
            <option value="WORK_DONE">Work Done ({completedCount})</option>
          </select>
        </div>

        {/* Main Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181309] text-white font-bold uppercase tracking-wider border-b border-[#2d2516]">
              <tr>
                <th className="px-3.5 py-3 whitespace-nowrap min-w-[120px]">Req ID</th>
                <th className="px-3.5 py-3 whitespace-nowrap min-w-[160px]">Vendor Name</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[140px]">Location</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[130px]">Contact Number</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[150px]">Item Name</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[120px]">Deadline Date</th>
                <th className="px-3 py-3 min-w-[180px]">Feedback</th>
                <th className="px-3 py-3 min-w-[150px]">Attachments</th>
                <th className="px-3.5 py-3 text-center whitespace-nowrap min-w-[140px]">Work Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    No special work requests found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                    {/* Req ID */}
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.requestId}
                    </td>

                    {/* Vendor Name */}
                    <td className="px-3.5 py-3 font-bold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.vendorName}
                    </td>

                    {/* Location */}
                    <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap border-r border-slate-200/60">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    {/* Contact Number */}
                    <td className="px-3 py-3 font-mono text-slate-800 whitespace-nowrap border-r border-slate-200/60">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{item.contactNumber}</span>
                      </div>
                    </td>

                    {/* Item Name */}
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap border-r border-slate-200/60">
                      {item.itemName}
                    </td>

                    {/* Deadline Date */}
                    <td className="px-3 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{item.deadlineDate}</span>
                      </div>
                    </td>

                    {/* Feedback */}
                    <td className="px-3 py-3 text-slate-600 text-[11px] border-r border-slate-200/60 max-w-xs">
                      {item.feedback ? (
                        <p className="line-clamp-2">{item.feedback}</p>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>

                    {/* Attachments */}
                    <td className="px-3 py-3 border-r border-slate-200/60">
                      {item.attachments && item.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.attachments.map((file, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                              title={file}
                            >
                              <Paperclip className="w-3 h-3 text-slate-500" />
                              <span className="max-w-[90px] truncate">{file}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">-</span>
                      )}
                    </td>

                    {/* Work Done Action Column */}
                    <td className="px-3.5 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleWorkDone(item)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          item.status === 'WORK_DONE'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        {item.status === 'WORK_DONE' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Work Done</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Mark Work Done</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
