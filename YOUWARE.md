# Plantables Manufacturing Dashboard

A modern, eco-friendly manufacturing dashboard for Plantables, built with React, Tailwind CSS, and TypeScript.

## Project Overview

- **Purpose**: Manage manufacturing orders, track production progress, and handle SOPs for sustainable products.
- **Theme**: Eco-friendly aesthetic (Deep Forest Green, Earth Tones, Clean UI).
- **Tech Stack**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)
  - Lucide React (Icons)
  - Google Apps Script API (Backend)

## Key Features

1.  **Dashboard Overview**:
    -   Sidebar navigation with status indicators.
    -   Search and filter products by status (Active, Urgent, Completed).
    -   **Real-time Sync Status**: Visual indicator for background syncing.
2.  **Product Detail View**:
    -   Hero section with product image and key actions.
    -   **Smart Deadline Tracking**: Displays "Days Left" or "Overdue" status with color-coded alerts.
    -   **Daily Production Target**: Automatically calculates required daily output to meet deadlines.
    -   Production stats (Total Qty, Completed, Efficiency).
    -   Visual progress bars (Linear and Circular concepts).
    -   SOP (Standard Operating Procedure) Checklist with progress tracking.
    -   **Optimistic Updates**: Immediate UI feedback for all actions (Qty updates, SOP toggles) without page reloads.
3.  **Product Management**:
    -   Add/Edit Product Modal.
    -   Delete Product functionality.
    -   Real-time updates to Google Sheets via API.
4.  **Responsive Design**:
    -   Mobile-friendly layout with collapsible sidebar.
    -   **Print Optimized**: Clean PDF exports with corrected image orientation and removed UI clutter.

## Development

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

## API Integration

The application connects to a Google Apps Script endpoint:
`https://script.google.com/macros/s/AKfycbwaKu6Vq-K_tQ0mayBU44w0LK36OCiDcFa87HIADiHiqz1r2BkOpCbmHU36760H1r89/exec`

-   **GET**: Fetches all products.
-   **POST**: Handles Add, Edit, Delete, and Update actions.

## Design System

-   **Primary Color**: `#2F7D32` (Forest Green)
-   **Secondary Color**: `#8D6E63` (Earth Brown)
-   **Urgent**: `#D32F2F`
-   **Completed**: `#1976D2`
-   **Font**: Poppins (via Google Fonts)
