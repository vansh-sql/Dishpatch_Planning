# Backend Integration & Architecture Guide
**Project:** Dispatch Planning ERP (Frontend)
**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4

---

## 1. Introduction
This document serves as a technical handoff for the Backend Team. The frontend is built as a complete, fully functional prototype using **Mock Data** and **localStorage** to simulate database persistence. 

To connect the real backend, **you do not need to modify the UI components**. All data transactions are centralized in a single service layer.

---

## 2. Directory Structure Overview
Here is the high-level architecture of the `src` directory. You only need to focus on the `services` and `types` folders for API integration.

```text
src/
├── components/       # Reusable UI elements (Modals, Badges, Navbar) - NO API LOGIC HERE
├── pages/            # Main screen views (Dashboard, PendingPIPage, etc.) - NO API LOGIC HERE
├── types/            
│   └── index.ts      # (IMPORTANT) Contains all TypeScript Interfaces & JSON schemas
└── services/         
    └── api.ts        # (CRITICAL) The ONLY file where backend APIs need to be integrated
```

---

## 3. The Data Models (`src/types/index.ts`)
Before creating REST APIs, refer to `src/types/index.ts`. This file defines the exact JSON structure the frontend expects.

**Key Models:**
1. `ProformaInvoice`: Represents an order (Pending, Approved, etc.)
2. `DispatchPlan`: Represents a Loading Slip / Dispatch schedule.
3. `Vehicle` / `Driver` / `Warehouse`: Master data models.

*Note: If your backend returns different keys (e.g., `invoice_no` instead of `piNumber`), you will need to map them inside `api.ts` before returning data to the UI.*

---

## 4. API Integration Layer (`src/services/api.ts`)
The entire application relies on a singleton class called `DispatchDataService` inside `api.ts`. It currently uses a **Publisher-Subscriber (Pub/Sub) pattern** combined with `localStorage`.

### Current Flow (Mock):
1. UI calls `dispatchService.getPIs()` (Synchronous).
2. UI calls `dispatchService.updatePIStatus(...)`.
3. `api.ts` updates `localStorage` and triggers `this.notifySubscribers()`.
4. React components auto-re-render with fresh data.

### How to Integrate Real APIs:
Since standard REST APIs are asynchronous (Promises), the backend team will need to modify the methods in `api.ts` to handle async calls.

#### Example: Fetching Pending PIs
**Current (Mock):**
```typescript
public getPendingPIs(): ProformaInvoice[] {
  return this.pis.filter((pi) => pi.status === 'PENDING');
}
```

**New (Real API integration example):**
```typescript
// Add async data fetching method
public async fetchPIsFromAPI(): Promise<void> {
  try {
    const response = await fetch('https://api.yourdomain.com/v1/proforma-invoices');
    const data = await response.json();
    this.pis = data; // Update local state
    this.notifySubscribers(); // Triggers UI update
  } catch (error) {
    console.error("Failed to fetch APIs", error);
  }
}

// Keep the synchronous getter for the UI, but ensure data is fetched on app load
public getPendingPIs(): ProformaInvoice[] {
  return this.pis.filter((pi) => pi.status === 'PENDING');
}
```

#### Example: Creating a Dispatch Plan (POST Request)
**Current (Mock):**
```typescript
public createDispatchPlan(plan: Omit<DispatchPlan, 'id'>): DispatchPlan {
  const newPlan = { ...plan, id: generateId() };
  this.dispatchPlans.push(newPlan);
  this.saveData();
  this.notifySubscribers();
  return newPlan;
}
```

**New (Real API integration example):**
```typescript
public async createDispatchPlan(plan: Omit<DispatchPlan, 'id'>): Promise<DispatchPlan> {
  const response = await fetch('https://api.yourdomain.com/v1/dispatch-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan)
  });
  
  const newPlan = await response.json();
  
  // Update local cache and notify UI
  this.dispatchPlans.push(newPlan);
  this.notifySubscribers();
  
  return newPlan;
}
```
*(Note: Because the frontend methods are currently synchronous, changing them to `async/await` may require wrapping the UI button handlers in `try/catch` and adding loading states).*

---

## 5. Step-by-Step Checklist for Backend Team

- [ ] **Step 1:** Review `src/types/index.ts` to understand the expected JSON payloads.
- [ ] **Step 2:** Build REST API endpoints (GET, POST, PUT, DELETE) corresponding to the data models.
- [ ] **Step 3:** Open `src/services/api.ts`.
- [ ] **Step 4:** Replace `localStorage.getItem` and `localStorage.setItem` logic with API `fetch()` or `axios` calls.
- [ ] **Step 5:** Call `this.notifySubscribers()` after successful mutations (POST/PUT/DELETE) so the React UI automatically reflects the changes without page reloads.
- [ ] **Step 6:** Remove `src/mockData.ts` and `INITIAL_X` dummy data from `api.ts`.

---
*Generated for the Backend & API Integration Team.*
