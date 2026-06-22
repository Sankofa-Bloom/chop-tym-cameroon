
# ChopTym Logistics Platform Upgrade — Phased Plan

This is a large, multi-module upgrade. To ship safely without touching food ordering, restaurants, dishes, payments, or financial transactions, I'll deliver it in **4 phases**. Each phase is independently shippable and testable. I'll confirm before moving to the next phase.

The existing tables (customers, customer_locations, customer_sessions, whatsapp_messages, rider_assignment_logs, rider_location_history, delivery_routes, order_locations, upgraded riders/operational_orders/delivery_zones) will be used as-is. No schema changes unless a specific gap blocks a feature — in which case I'll surface it as a migration with explanation.

---

## Phase 1 — Customer Management + WhatsApp Ops Center

New admin routes under `/admin`:
- `/admin/customers` — directory (search by phone/name), profile drawer with saved locations, recent orders, totals, language, notes, preferences JSON
- `/admin/customers/:id` — full profile page with map of saved locations (Home / Office / Shop / School / Custom)
- `/admin/whatsapp` — live conversations list (phone, name, session state, last message, status) backed by `customer_sessions` + `whatsapp_messages`, with conversation view, reset state, manual intervention (send message via edge function stub)

New files:
- `src/pages/admin/AdminCustomers.tsx`, `AdminCustomerDetail.tsx`, `AdminWhatsApp.tsx`
- `src/hooks/useCustomers.ts`, `useCustomerLocations.ts`, `useCustomerSessions.ts`, `useWhatsAppMessages.ts`
- `src/components/admin/customers/*` (CustomerCard, LocationMap, OrderHistoryList)
- `src/components/admin/whatsapp/*` (ConversationList, ConversationThread, SessionStateBadge)
- Add nav entries in `AdminLayout` under an "Operations" group
- Add routes in `App.tsx`

Realtime: subscribe to `customer_sessions` + `whatsapp_messages` in `useEffect`, cleanup with `removeChannel`.

---

## Phase 2 — Rider Operations + Live Map + Zones

- Upgrade `/admin/delivery` (or new `/admin/riders`) with rider status, current location, last seen, active orders, rating, completed orders, plus per-rider performance dashboard (today/week, avg time, acceptance %, completion %).
- New `/admin/map` — Mapbox-based Operations Map showing active riders, pickup/dropoff pins, delivery zones polygons, layer toggles (active riders, pending, in-progress, completed, high demand). Real-time updates via Supabase channels.
- Upgrade `/admin/zones` UI to render polygons on map, list with totals, activation toggle.

Mapbox requires a public token — I'll prompt the user to add `VITE_MAPBOX_PUBLIC_TOKEN` as a secret (publishable, safe in frontend).

New hooks: `useRiders`, `useRiderLocationHistory`, `useRiderAssignmentLogs`, `useDeliveryZones` (extend).

---

## Phase 3 — Route Intelligence + Operational Orders upgrade + Heatmaps + Analytics

- `/admin/routes` — Route Intelligence (most used, most profitable, avg times/fees) with map visualization from `delivery_routes`.
- Upgrade `OrderCard` / `OrderDetailSheet` in operational orders to show pickup/dropoff points, landmarks, notes, est. distance/duration, mini map.
- `/admin/heatmaps` — demand heatmap from `customer_location_history` and `order_locations`.
- `/admin/insights` (or new `/admin/logistics-analytics`) — orders today/week/month, revenue, top zones/riders/customers, avg delivery time, distance, acceptance %, completion %.

---

## Phase 4 — AI Dispatch + AI Customer Insights

Two edge functions calling Lovable AI Gateway (`google/gemini-3-flash-preview`):
- `ai-dispatch-suggest` — given an order, returns ranked rider suggestions (best/closest/fastest/least-busy) with reason + distance + workload. Admin must approve; no auto-assign.
- `ai-customer-insights` — given a customer, returns frequent locations, favorite services, ordering patterns, peak times, repeat analysis.

UI: "Suggest Rider" button on operational order detail; "AI Insights" panel on customer profile.

Bilingual EN/FR copy throughout (small `src/lib/i18n.ts` dictionary keyed off `customers.preferred_language`). Customer-facing automation messages are templated in EN+FR; admin UI stays in English.

---

## Out of Scope (per your instructions)

Food ordering, restaurants, dishes, payment methods, financial transactions — completely untouched.

---

## Technical Notes

- All new tables already exist; no destructive schema changes planned. If any column is missing for a feature, I'll call it out before adding it.
- Mapbox via `react-map-gl` + `mapbox-gl`. Requires `VITE_MAPBOX_PUBLIC_TOKEN`.
- Realtime: subscribe in `useEffect`, cleanup via `removeChannel`.
- AI features: edge functions only; `LOVABLE_API_KEY` server-side.
- Reuses existing design system (no new colors, no hardcoded `bg-*`).
- New nav grouped under existing admin zones (Ops, Insights) — no new top-level zones.

---

## What I need from you to start Phase 1

1. **Approve this phased approach** (Phase 1 first, then I'll check in before Phase 2).
2. Confirm you have (or want me to request) a **Mapbox public token** for Phase 2.

Once approved, I'll start Phase 1 immediately.
