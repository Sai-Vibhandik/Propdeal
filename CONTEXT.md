# Project Context - Quick Reference

> Last Updated: June 6, 2025

---

## 🎯 Current Status

**Working Phase:** Admin Property CRUD (Phase 7 continuation)
**Next Task:** Create Property Form (multi-step form for creating/editing properties)
**Last Completed:** AdminPropertiesPage.jsx - Property list with filters

---

## 🛠️ Technology Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4 (NOT v3 - different syntax)
- Framer Motion (animations)
- React Router 7
- TanStack React Query
- react-hot-toast (notifications)
- lucide-react (icons)

### Backend
- Node.js + Express 5 (ES modules)
- MongoDB + Mongoose
- JWT authentication
- Cloudinary (media storage)
- Ollama (local AI)

---

## ⚠️ Important Rules

### Field Naming (CRITICAL)
- **Email fields**: "Email ID" (not "Email" or "Email Address")
- **Phone fields**: "Contact Number" (not "Phone" or "Phone Number")
- **Required field asterisk**: No space before asterisk
  - ✅ Correct: `Email ID*`
  - ❌ Wrong: `Email ID *`

### Error Messages
- All inline (below field)
- Must end with fullstop: "This field is required."
- Use toast notifications only (react-hot-toast)

### Tailwind CSS v4
- DO NOT use `@apply` directive (not supported in v4)
- Use plain CSS or Tailwind classes directly
- Animations use Framer Motion

---

## 📁 Key File Locations

### Backend Entry
- `backend/src/index.js` - Server entry point
- `backend/src/routes/index.js` - All routes

### Frontend Entry
- `frontend/src/App.jsx` - Routes and providers
- `frontend/src/main.jsx` - App mount

### Constants
- `frontend/src/utils/constants.js` - Property types, statuses, etc.
- `frontend/src/utils/formatters.js` - Price, date formatters

### Context
- `frontend/src/context/AuthContext.jsx` - Auth state
- `frontend/src/context/FilterContext.jsx` - Filter state

---

## 🔗 API Endpoints

### Public
```
GET  /api/properties              # List properties
GET  /api/properties/featured     # Featured properties
GET  /api/properties/:slug        # Property by slug
POST /api/leads                   # Submit lead
```

### Admin (Protected)
```
POST /api/auth/login              # Login
GET  /api/auth/me                 # Current user
GET  /api/admin/properties        # List all
POST /api/admin/properties        # Create
PUT  /api/admin/properties/:id   # Update
DELETE /api/admin/properties/:id # Delete
```

---

## 🎨 Design System

### Colors
```
Primary:    #1e40af (Deep Blue)
Accent:     #d4af37 (Warm Gold)
Background: #fafafa (Off-white)
Surface:    #ffffff (White)
Text:       #1e293b (Slate)
Muted:      #64748b (Gray)
```

### Animation Presets
Located in `frontend/src/styles/animations.js`
- fadeInUp, fadeIn, staggerContainer, scaleOnHover, slideInModal

---

## 📋 Property Form Steps (Next Task)

### Step 1: Basic Info
- Property name
- Builder name
- Property type (apartment, villa, plot, etc.)
- Category (under-construction, ready-to-move, etc.)
- Configurations (1BHK, 2BHK, etc.)
- Short description

### Step 2: Location
- Full address
- Locality
- City
- State
- Pincode
- Landmark
- Google Maps URL
- Coordinates (lat, lng)

### Step 3: Pricing
- Price range (min, max)
- Price unit (lac, cr)
- Configuration-wise pricing
- Possession date

### Step 4: Media
- Hero image upload
- Gallery images
- Video upload
- Brochure upload

### Step 5: Settings
- Status (draft, published)
- Featured toggle
- RERA number
- Sections enable/disable
- Theme customization

---

## 🔄 How to Continue

1. **Start with:** `PropertyFormPage.jsx` and `PropertyForm.jsx`
2. **Follow conventions:** Check existing components for patterns
3. **Use constants:** Import from `utils/constants.js`
4. **Form validation:** Follow field naming rules above
5. **API integration:** Use `services/api.js`

---

## 📝 Notes

- Always use ES modules (import/export)
- All pages must be responsive (mobile-first)
- Use Framer Motion for animations
- Check `PLAN.md` for detailed implementation plan