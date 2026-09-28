import React, { useState } from 'react';
import { Download, Search, ShoppingBag, Filter, CheckCircle, Clock } from 'lucide-react';

export const KBOrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Kb Orders Registry
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold border border-indigo-200">
              KB Fulfillment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and process Key Account & KB specialized sales order dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Placeholder KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Total KB Orders
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">0 Orders</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-amber-400">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Pending Processing
            </span>
            <span className="text-base font-extrabold text-amber-700 mt-0.5 block">0 Pending</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">
              Completed Orders
            </span>
            <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">0 Delivered</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 text-center">
        <ShoppingBag className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
        <h3 className="text-sm font-bold text-slate-800">Kb Orders Module Ready</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          This page is configured for backend API integration. KB Order processing details and status logs will be rendered here.
        </p>
      </div>
    </div>
  );
};
