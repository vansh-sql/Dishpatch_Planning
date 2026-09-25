import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  FileText,
  ExternalLink,
  Package,
  Clock,
  CheckCircle,
  Building2,
  Filter,
} from 'lucide-react';
import { dispatchService } from '../services/api';
import { POPickup } from '../types';

interface POPickupPageProps {
  onNavigate?: (path: string) => void;
}

export const POPickupPage: React.FC<POPickupPageProps> = () => {
  const [pickups, setPickups] = useState<POPickup[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [vendorTypeFilter, setVendorTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    const loadData = () => {
      setPickups(dispatchService.getPOPickups());
    };
    loadData();
    const unsub = dispatchService.subscribe(loadData);
    return () => unsub();
  }, []);

  const filteredPickups = pickups.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesVendorType = vendorTypeFilter === 'ALL' || item.vendorType === vendorTypeFilter;
    const matchesSearch =
      item.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesVendorType && matchesSearch;
  });

  const pendingCount = pickups.filter((p) => p.status === 'PENDING').length;
  const scheduledCount = pickups.filter((p) => p.status === 'SCHEDULED').length;

  const handleExportCSV = () => {
    const headers = [
      'Unique Id',
      'PO Number',
      'P.O Dated',
      'Vendor Type',
      'Contact Person Name',
      'Vendor Code',
      'Vendor Name',
      'Contact Person No',
      'Vendor Address',
      'Payment Term',
      'Delivery Date',
      'PDF File',
      'Actual Fill Purchase Team',
    ];

    const rows = filteredPickups.map((p) => [
      p.uniqueId,
      p.poNumber,
      p.poDated,
      p.vendorType,
      `"${p.contactPersonName}"`,
      p.vendorCode,
      `"${p.vendorName}"`,
      p.contactPersonNo,
      `"${p.vendorAddress}"`,
      p.paymentTerm,
      p.deliveryDate,
      p.pdfUrl || '',
      p.actualFillPurchaseTeam,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PO_Pickup_Registry_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              PO Pickup Management Registry
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold border border-purple-200">
              {pendingCount} Pending Pickup
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor purchase order pickups, vendor dispatch schedules, and purchase team fill logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Small Box Type) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Total PO Pickups
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
              {pickups.length} Pickups
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-amber-400">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Pending Pickups
            </span>
            <span className="text-base font-extrabold text-amber-700 mt-0.5 block">
              {pendingCount} Pending
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Scheduled Pickups
            </span>
            <span className="text-base font-extrabold text-blue-700 mt-0.5 block">
              {scheduledCount} Assigned
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Completed Pickups
            </span>
            <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">
              {pickups.filter((p) => p.status === 'COMPLETED').length} Received
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO number, unique ID, vendor code or name..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F4B400]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#F4B400]"
          >
            <option value="ALL">All Pickup Statuses</option>
            <option value="PENDING">Pending Pickup ({pendingCount})</option>
            <option value="SCHEDULED">Scheduled ({scheduledCount})</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={vendorTypeFilter}
            onChange={(e) => setVendorTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#F4B400]"
          >
            <option value="ALL">All Vendor Types</option>
            <option value="Company">Company</option>
            <option value="Broker">Broker</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-700 text-white font-bold uppercase tracking-wider border-b border-emerald-800">
              <tr>
                <th className="px-3.5 py-3 whitespace-nowrap min-w-[110px]">Unique Id</th>
                <th className="px-3.5 py-3 whitespace-nowrap min-w-[140px]">PO Number</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[100px]">P.O Dated</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[100px]">Vendor Type</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[130px]">Contact Person Name</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[120px]">Vendor Code</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[160px]">Vendor Name</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[130px]">Contact Person No</th>
                <th className="px-3 py-3 min-w-[180px]">Vendor Address</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[110px]">Payment Term</th>
                <th className="px-3 py-3 whitespace-nowrap min-w-[100px]">Delivery Date</th>
                <th className="px-3 py-3 text-center whitespace-nowrap min-w-[100px]">PDF File</th>
                <th className="px-3.5 py-3 whitespace-nowrap min-w-[160px]">Actual Fill Purchase Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-emerald-50/30">
              {filteredPickups.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-12 text-center text-slate-400">
                    No PO Pickups found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredPickups.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                    {/* Unique Id */}
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.uniqueId}
                    </td>

                    {/* PO Number */}
                    <td className="px-3.5 py-3 font-mono font-bold text-indigo-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.poNumber}
                    </td>

                    {/* P.O Dated */}
                    <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap border-r border-slate-200/60">
                      {item.poDated}
                    </td>

                    {/* Vendor Type */}
                    <td className="px-3 py-3 whitespace-nowrap border-r border-slate-200/60">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.vendorType === 'Company'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-purple-100 text-purple-900 border border-purple-200'
                        }`}
                      >
                        {item.vendorType}
                      </span>
                    </td>

                    {/* Contact Person Name */}
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap border-r border-slate-200/60">
                      {item.contactPersonName || '-'}
                    </td>

                    {/* Vendor Code */}
                    <td className="px-3 py-3 font-mono text-slate-700 whitespace-nowrap border-r border-slate-200/60">
                      {item.vendorCode || '-'}
                    </td>

                    {/* Vendor Name */}
                    <td className="px-3 py-3 font-bold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.vendorName || '-'}
                    </td>

                    {/* Contact Person No */}
                    <td className="px-3 py-3 font-mono text-slate-700 whitespace-nowrap border-r border-slate-200/60">
                      {item.contactPersonNo || '-'}
                    </td>

                    {/* Vendor Address */}
                    <td className="px-3 py-3 text-slate-600 text-[11px] border-r border-slate-200/60">
                      {item.vendorAddress || '-'}
                    </td>

                    {/* Payment Term */}
                    <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap border-r border-slate-200/60">
                      {item.paymentTerm || '-'}
                    </td>

                    {/* Delivery Date */}
                    <td className="px-3 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap border-r border-slate-200/60">
                      {item.deliveryDate}
                    </td>

                    {/* PDF File Link */}
                    <td className="px-3 py-3 text-center whitespace-nowrap border-r border-slate-200/60">
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 transition-colors"
                          title="Open PO PDF Document"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>View PDF</span>
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">-</span>
                      )}
                    </td>

                    {/* Actual Fill Purchase Team */}
                    <td className="px-3.5 py-3 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                      {item.actualFillPurchaseTeam}
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
