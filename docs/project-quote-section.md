# Rebuild checklist: “Get Your Project Quote” section

**Status:** This section is **not currently mounted** on the site. The implementation file `src/components/sections/AssessmentSection.tsx` was removed; use this document to restore it (re-add the component and import it from `src/app/page.tsx`).

This document registers everything needed to reproduce the **project quote / assessment** block on the marketing site—the section titled **“Get Your Project Quote”**.

---

## 1. What it is

- **User-facing name:** “Get Your Project Quote” (section heading).
- **Purpose:** Multi-step configurator: pick a **project type**, toggle **features**, choose **design** and **support**, see a **price range**, optionally open a **contact form** and **email estimate** UI.
- **DOM anchor:** `id="assessment"` — used for in-page links such as `/#assessment` and `#assessment`.

---

## 2. Source files (required)

| Role | Path |
|------|------|
| **Main implementation** | `src/components/sections/AssessmentSection.tsx` |
| **Home page usage** | `src/app/page.tsx` — import and render `<AssessmentSection />` (typically after hero/process/trust). |
| **Global layout & styles** | `src/app/layout.tsx` (font), `src/app/globals.css` → `src/styles/globals.css` |
| **Shared utility classes** | `.section-padding`, `.container-max`, `.btn-primary`, `.btn-secondary` — defined in `src/styles/globals.css` (`@layer components`). |
| **Theme colors** | `tailwind.config.js` — `primary` and `secondary` palettes (section uses `primary-*` heavily). |

No API routes or server actions are required for the current UI; **“Send” estimate** only toggles local state and `console.log`s (see §7).

---

## 3. Framework & dependencies

- **Next.js** (App Router) + **React**.
- **Client component:** `'use client'` at top of `AssessmentSection.tsx` (uses `useState`).
- **Styling:** **Tailwind CSS** only (no section-specific CSS file).

---

## 4. Data you must port

All catalog data lives **inside** `AssessmentSection.tsx` (not imported from JSON).

### 4.1 `projectTypes`

- Array of objects: `id`, `name`, `description`, and **`basePrice`** (number, USD).
- **Exception:** Two entries use **`price`** instead of `basePrice` (`deployment-setup`, `security-hardening`). The price calculator uses `project.basePrice || 0`, so those two need **`basePrice`** (or align the field name) or their base contribution will be **0** unless you fix the reducer.

### 4.2 `features`

- Large array: `id`, `name`, `price`, `description`.
- **Note:** Duplicate `id` values exist (e.g. `user-profiles` appears more than once). Only the **first** match wins in `features.find(...)`, so duplicates are effectively dead rows unless deduplicated.

### 4.3 `designOptions`

- `id`, `name`, `price`, `description` (template vs custom vs brand).

### 4.4 `supportOptions`

- `id`, `name`, `price`, `description` (3 weeks free through 1 year).

### 4.5 `projectTypeDefaults`

- `Record<projectTypeId, featureId[]>` — when a project type is chosen, those feature IDs are pre-selected and the UI advances to step 2.

### 4.6 `featureCategories`

- Derived grouping of `features` by category labels (Core, Content & CMS, etc.) — used only for rendering the feature checklist in step 2.

---

## 5. State & flow (behavior)

| State | Role |
|-------|------|
| `selectedProject` | Current project type `id`. |
| `selectedFeatures` | List of selected feature `id`s (checkboxes). |
| `selectedDesign` | Single design option `id` (radio). |
| `selectedSupport` | Single support option `id` (radio). |
| `currentStep` | `1`–`4` (project → features → design → support). |
| `showContactForm` | Shows/hides the “Let’s Discuss Your Project” form block. |
| `contactDetails` | Bound to project details `<textarea>`. |
| `emailForEstimate` | Email field for “Email me this estimate”. |
| `estimateSent` | Shows success line after “Send” on estimate email. |

**Interactions:**

- Choosing a project type runs `handleProjectTypeChange`: sets defaults from `projectTypeDefaults`, sets `currentStep` to **2**.
- Steps 2–4: sidebar shows one panel at a time (`currentStep === n`); “Next” / “Previous” and inline “Next: Design →” etc. change `currentStep`.
- **Price range:** `calculatePrice()` — base (`basePrice`) + sum of selected feature prices + design + support; result is **`[0.9 × total, 1.1 × total]`** rounded (min/max display).

---

## 6. UI structure (layout to recreate)

1. **Outer:** `<section id="assessment" className="section-padding bg-white">` + `container-max`.
2. **Header block:** Centered title “Get Your Project Quote” + subtitle.
3. **Grid:** `grid-cols-1 lg:grid-cols-3 gap-8`.
4. **Left column (`lg:col-span-1`):** Sticky card (`bg-gray-50`, `rounded-2xl`, `sticky top-8`) containing:
   - Step indicator (“Step X of 4” + progress bars).
   - Step 1: scrollable project type list (buttons).
   - Step 2: categorized feature checkboxes (scrollable).
   - Step 3: design radios.
   - Step 4: support radios.
   - Footer: Previous / Next buttons.
5. **Right column (`lg:col-span-2`):** Shown when `selectedProject` is set:
   - Estimate card (`bg-primary-50`, price range, timeline copy, CTA buttons, email row, guarantee line).
   - Optional contact form block when `showContactForm` is true.

**CTA labels in the estimate card:** “Get Detailed Quote”, “Book Free Consultation” (both currently open the contact form), “Send” for email estimate.

---

## 7. Integrations (current stubs)

- **Email estimate “Send”:** Sets `estimateSent`, logs `console.log('estimate_emailed', { email })` — **no backend**, no mail provider.
- **Contact form `<form>`:** No `onSubmit` handler, no action — **non-functional** until wired to an API or service.

Document any future endpoint, spam protection, and privacy copy when you implement this.

---

## 8. Styling checklist for a faithful rebuild

- Tailwind **`primary-*`** for accents, selected borders, estimate headline, buttons.
- Reuse **`.btn-primary`** / **`.btn-secondary`** from global CSS.
- **`.section-padding`** and **`.container-max`** for alignment with the rest of the site.
- Responsive: single column on small screens; **3-column** layout from `lg` breakpoint.

---

## 9. Links into this section (keep anchor stable)

If you change `id`, update any in-page links that point to `#assessment` (e.g. hero CTAs) when the section is restored.

---

## 10. Minimal rebuild order

1. Copy **Tailwind theme** (`primary` colors) and **global component classes** (buttons, section, container).
2. Port **data arrays** and **`projectTypeDefaults`** / **`featureCategories`**.
3. Implement **client component** with the **state** and **`calculatePrice`** logic.
4. Build **layout** (sticky sidebar + estimate panel + optional form).
5. Decide whether to **fix** `basePrice` vs `price` on devops items and **dedupe** feature `id`s.
6. Optionally replace stubs with **real form submission** and **email** behavior.

---

*Last aligned with implementation in `AssessmentSection.tsx` as of the doc creation date.*
