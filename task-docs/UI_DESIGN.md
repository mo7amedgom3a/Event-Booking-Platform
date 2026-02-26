# UI Design Guidelines & Mockups

## Design Principles

### Visual Design
- **Modern & Clean**: Minimalist design with plenty of white space
- **Professional**: Suitable for a commercial platform
- **User-Friendly**: Intuitive navigation and clear CTAs
- **Accessible**: WCAG 2.1 AA compliance (at least basic)
- **Consistent**: Unified design language across all pages

### Color Scheme (Suggested)
```css
Primary: #3B82F6 (Blue)
Secondary: #10B981 (Green)
Accent: #F59E0B (Amber)
Danger: #EF4444 (Red)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)

Text:
  - Primary: #1F2937 (Gray-800)
  - Secondary: #6B7280 (Gray-500)
  - Muted: #9CA3AF (Gray-400)

Background:
  - White: #FFFFFF
  - Light Gray: #F9FAFB (Gray-50)
  - Card: #FFFFFF with shadow

Borders: #E5E7EB (Gray-200)
```

### Typography
```css
Headings:
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 2rem (32px), font-weight: 600
  - H3: 1.5rem (24px), font-weight: 600
  - H4: 1.25rem (20px), font-weight: 600

Body:
  - Regular: 1rem (16px), font-weight: 400
  - Small: 0.875rem (14px), font-weight: 400

Font Family: Inter, system-ui, -apple-system, sans-serif
```

## Page Mockups & Requirements

### 1. Home Page

#### Hero Section
```
┌─────────────────────────────────────────────────────┐
│  [Logo]                         [Login] [Register] │
├─────────────────────────────────────────────────────┤
│                                                     │
│        Discover Amazing Events Near You             │
│     Find and book tickets for concerts, conferences,│
│              workshops, and more                    │
│                                                     │
│    [Search Events...]            [Browse Events →] │
│                                                     │
│              [Background Image/Gradient]            │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Large hero heading (H1)
- Subheading with value proposition
- Search bar with autocomplete
- CTA button (Browse Events)
- Background: Gradient or hero image
- Sticky navigation header

#### Featured Events Section
```
┌─────────────────────────────────────────────────────┐
│               Featured Events                       │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐│
│  │ [Image] │  │ [Image] │  │ [Image] │  │ [Image]││
│  │         │  │         │  │         │  │        ││
│  │ Title   │  │ Title   │  │ Title   │  │ Title  ││
│  │ Date    │  │ Date    │  │ Date    │  │ Date   ││
│  │ $50     │  │ $75     │  │ $30     │  │ $100   ││
│  │ [Book]  │  │ [Book]  │  │ [Book]  │  │ [Book] ││
│  └─────────┘  └─────────┘  └─────────┘  └────────┘│
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Grid of 4 event cards (horizontal scroll on mobile)
- Each card: Image, Title, Date, Price, Book button
- Hover effects (slight scale up)

#### Categories Section
```
┌─────────────────────────────────────────────────────┐
│             Browse by Category                      │
│                                                     │
│  [🎵 Music]  [💼 Business]  [🎨 Arts]  [⚽ Sports] │
│  [💻 Tech]   [🎭 Theater]   [🍽️ Food]  [📚 Education]│
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Icon buttons for each category
- Click to filter events by category

#### How It Works Section
```
┌─────────────────────────────────────────────────────┐
│              How It Works                           │
│                                                     │
│  1. Browse Events  →  2. Book Tickets  →  3. Attend│
│     [Icon]              [Icon]              [Icon]  │
│   Description         Description          Description│
└─────────────────────────────────────────────────────┘
```

### 2. Events List Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Events    [Search...]      [Login] [Cart] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Filters          │  Events                        │
│  ─────────       │                                 │
│                  │  ┌───────────────────────────┐  │
│  Categories      │  │ [Image]  Event Title      │  │
│  □ Music         │  │          Date • Location  │  │
│  □ Business      │  │          $50 • 45 seats   │  │
│  □ Sports        │  │          [View Details]   │  │
│                  │  └───────────────────────────┘  │
│  Date Range      │  ┌───────────────────────────┐  │
│  [From] [To]     │  │ [Image]  Event Title      │  │
│                  │  │          Date • Location  │  │
│  Price Range     │  │          Free • 100 seats │  │
│  [Min] [Max]     │  │          [View Details]   │  │
│                  │  └───────────────────────────┘  │
│  Location        │                                 │
│  [City...]       │  [Pagination: ← 1 2 3 4 →]     │
│                  │                                 │
│  [Apply Filters] │                                 │
└──────────────────┴─────────────────────────────────┘
```

**Elements:**
- Sidebar with filters (collapsible on mobile)
- Event cards with horizontal layout
- Pagination or "Load More" button
- Sort dropdown (Date, Price, Popularity)
- Clear filters button
- Empty state if no results

### 3. Event Detail Page

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Events                    [Login] [Cart]│
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────┐  Event Title              │
│  │                     │  ★★★★☆ (4.5) • 120 reviews│
│  │   [Event Image]     │                           │
│  │                     │  📅 Date & Time            │
│  │                     │  Friday, June 15, 2024    │
│  │                     │  7:00 PM - 10:00 PM       │
│  └─────────────────────┘                           │
│                          📍 Location                │
│  About This Event       San Francisco, CA          │
│  ─────────────────                                 │
│  [Event Description]    💰 Price                   │
│  Lorem ipsum dolor      $50 per ticket             │
│  sit amet...                                       │
│                         👥 Available Seats          │
│  Organizer Info         45 / 100 remaining         │
│  ─────────────────                                 │
│  [Avatar] John Doe      ┌──────────────────────┐  │
│  Tech Events Inc.       │ Number of Tickets:   │  │
│  [Contact]              │ [- 1 +]              │  │
│                         │                      │  │
│                         │ Total: $50           │  │
│                         │                      │  │
│                         │ [Book Now →]         │  │
│                         └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Large event image
- Event details (date, time, location, price)
- Available seats with progress bar
- Booking widget (quantity selector, total, CTA)
- Organizer information
- Share buttons (optional)
- Related events (optional)

### 4. Login/Register Pages

#### Login Page
```
┌─────────────────────────────────────────────────────┐
│  [Logo]                                             │
│                                                     │
│         ┌─────────────────────────┐                │
│         │  Welcome Back           │                │
│         │                         │                │
│         │  Email                  │                │
│         │  [email@example.com]    │                │
│         │                         │                │
│         │  Password               │                │
│         │  [••••••••••]           │                │
│         │                         │                │
│         │  □ Remember me          │                │
│         │                         │                │
│         │  [Login]                │                │
│         │                         │                │
│         │  Forgot password?       │                │
│         │                         │                │
│         │  Don't have an account? │                │
│         │  [Register here]        │                │
│         └─────────────────────────┘                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Register Page
```
┌─────────────────────────────────────────────────────┐
│  [Logo]                                             │
│                                                     │
│         ┌─────────────────────────┐                │
│         │  Create Account         │                │
│         │                         │                │
│         │  First Name             │                │
│         │  [John]                 │                │
│         │                         │                │
│         │  Last Name              │                │
│         │  [Doe]                  │                │
│         │                         │                │
│         │  Email                  │                │
│         │  [email@example.com]    │                │
│         │                         │                │
│         │  Password               │                │
│         │  [••••••••••]           │                │
│         │                         │                │
│         │  I am:                  │                │
│         │  ○ User  ○ Organizer    │                │
│         │                         │                │
│         │  [Register]             │                │
│         │                         │                │
│         │  Already have account?  │                │
│         │  [Login here]           │                │
│         └─────────────────────────┘                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Centered form card
- Clear field labels
- Validation errors below each field
- Toggle password visibility
- Social login (optional)
- Terms & conditions checkbox

### 5. User Profile Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Profile                    [User ▼]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐   Profile Information            │
│  │   [Avatar]   │   John Doe                       │
│  │              │   [email protected]               │
│  │  [Change]    │   Member since: Jan 2024         │
│  └──────────────┘   [Edit Profile]                 │
│                                                     │
│  Tabs: [Profile] [Bookings] [Settings]             │
│  ────────────────────────────────────────────       │
│                                                     │
│  My Bookings                      [View All →]     │
│  ┌───────────────────────────────────────────┐    │
│  │ Tech Conference 2024                      │    │
│  │ June 15, 2024 • 2 tickets                │    │
│  │ Status: Confirmed                         │    │
│  │ [View Tickets] [Cancel Booking]          │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │ Music Festival                             │    │
│  │ July 20, 2024 • 1 ticket                  │    │
│  │ Status: Confirmed                         │    │
│  │ [View Tickets] [Cancel Booking]          │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Avatar with upload option
- User information display
- Tab navigation
- Booking cards with status badges
- Action buttons

### 6. Organizer Dashboard

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Dashboard                  [User ▼]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Overview                     [+ Create Event]     │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │  Total   │ │  Active  │ │  Total   │ │Revenue ││
│  │  Events  │ │  Events  │ │ Bookings │ │        ││
│  │    12    │ │     8    │ │    450   │ │ $45,000││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
│  My Events                        [View All →]     │
│  ┌───────────────────────────────────────────┐    │
│  │ [Image] Tech Conference 2024              │    │
│  │         June 15, 2024 • 120 bookings      │    │
│  │         Status: Published                 │    │
│  │         [Edit] [View Bookings] [Cancel]   │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Recent Bookings                                    │
│  ┌───────────────────────────────────────────┐    │
│  │ John Doe • Tech Conference • 2 tickets    │    │
│  │ 2 hours ago                               │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Statistics cards
- Quick action button (Create Event)
- Event list with management options
- Recent bookings feed

### 7. Create/Edit Event Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Create Event              [User ▼]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Create New Event                                   │
│  ────────────────                                   │
│                                                     │
│  Basic Information                                  │
│                                                     │
│  Event Title *                                      │
│  [Enter event title...]                             │
│                                                     │
│  Category *                                         │
│  [Select category ▼]                                │
│                                                     │
│  Description *                                      │
│  [Describe your event...]                           │
│  (Rich text editor)                                 │
│                                                     │
│  Event Image *                                      │
│  [Upload Image] or [Enter URL]                      │
│  ┌─────────────┐                                    │
│  │  Preview    │                                    │
│  │  Image      │                                    │
│  └─────────────┘                                    │
│                                                     │
│  Date & Time                                        │
│                                                     │
│  Start Date *        Start Time *                   │
│  [📅 MM/DD/YYYY]    [🕐 HH:MM]                     │
│                                                     │
│  End Date *          End Time *                     │
│  [📅 MM/DD/YYYY]    [🕐 HH:MM]                     │
│                                                     │
│  Location                                           │
│                                                     │
│  Address *                                          │
│  [Street address...]                                │
│                                                     │
│  City *             Country *                       │
│  [City]             [Select country ▼]              │
│                                                     │
│  Coordinates (Optional)                             │
│  Latitude           Longitude                       │
│  [30.0444]         [31.2357]                        │
│                                                     │
│  Ticketing                                          │
│                                                     │
│  Price *            Currency *                      │
│  [50.00]           [USD ▼]                          │
│                                                     │
│  Total Capacity *                                   │
│  [100]                                              │
│                                                     │
│  Status                                             │
│  ○ Draft  ● Published                               │
│                                                     │
│  [Cancel]  [Save as Draft]  [Publish Event →]      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Multi-section form with clear grouping
- Date/time pickers
- Rich text editor for description
- Image upload with preview
- Validation indicators
- Save options (Draft/Publish)

## Component Library

### Reusable Components

#### Button Component
```jsx
// Variants: primary, secondary, outline, ghost, danger
<Button variant="primary" size="md" onClick={handleClick}>
  Book Now
</Button>
```

**Styles:**
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Outline: Border only, transparent background
- Ghost: No border, transparent background (hover effect)
- Danger: Red background, white text

**Sizes:** sm, md, lg

#### Card Component
```jsx
<Card>
  <CardHeader>
    <CardTitle>Event Title</CardTitle>
  </CardHeader>
  <CardContent>
    Event details here...
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Styles:**
- White background
- Subtle shadow
- Rounded corners (8px)
- Hover: Slight shadow increase

#### Input Component
```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  required
/>
```

**States:**
- Default
- Focus (blue border)
- Error (red border, error message)
- Disabled (gray background)

#### Modal Component
```jsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader>Confirm Booking</ModalHeader>
  <ModalBody>
    Are you sure you want to book this event?
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

#### Toast Notification
```jsx
// Success, Error, Warning, Info
toast.success('Booking confirmed!');
toast.error('Booking failed. Please try again.');
```

**Position:** Top-right
**Duration:** 3-5 seconds
**Auto-dismiss:** Yes
**Close button:** Yes

## Responsive Breakpoints

```css
Mobile: 0-639px (sm)
Tablet: 640-1023px (md)
Desktop: 1024px+ (lg)
```

### Mobile Considerations
- Hamburger menu for navigation
- Collapsible filter sidebar
- Stack layout for cards
- Bottom navigation (optional)
- Touch-friendly button sizes (min 44x44px)
- Swipeable carousels

## Loading States

### Skeleton Loaders
Use skeleton screens for:
- Event cards while loading
- Event details page
- Profile information

```
┌─────────────────┐
│ ░░░░░░░░░░░░░░ │ (Gray animated bar)
│ ░░░░░░░░░░     │
│ ░░░░ ░░░░░     │
└─────────────────┘
```

### Spinners
Use for:
- Button loading states
- Form submissions
- Inline loading

## Error States

### Error Messages
```
┌─────────────────────────────────┐
│  ⚠️ Oops! Something went wrong  │
│                                 │
│  We couldn't load the events.   │
│  Please try again later.        │
│                                 │
│  [Try Again]                    │
└─────────────────────────────────┘
```

### Empty States
```
┌─────────────────────────────────┐
│         🎭                      │
│                                 │
│  No events found                │
│                                 │
│  Try adjusting your filters or  │
│  browse all events              │
│                                 │
│  [Browse All Events]            │
└─────────────────────────────────┘
```

## Animation Guidelines

### Transitions
- Page transitions: 200-300ms
- Hover effects: 150ms
- Modal open/close: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Animations to Include
- Button hover (slight scale or color change)
- Card hover (shadow increase)
- Loading spinners
- Toast slide-in
- Modal fade-in
- Skeleton pulse

**Keep animations subtle and purposeful!**

## Accessibility Requirements

### Minimum Standards
- ✅ Semantic HTML (nav, main, article, etc.)
- ✅ Alt text for all images
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators visible
- ✅ Color contrast ratio 4.5:1 minimum
- ✅ Form labels properly associated
- ✅ Error messages announced to screen readers

## Design Tools & Resources

### Recommended Tools
- **Design:** Figma (optional, not required)
- **Icons:** Heroicons, Lucide React, or React Icons
- **Images:** Unsplash, Pexels (for placeholders)
- **Colors:** Tailwind CSS palette
- **Fonts:** Google Fonts (Inter, Poppins, Roboto)

### Useful Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible components
- **React Hot Toast**: Toast notifications
- **React Hook Form**: Form handling
- **date-fns**: Date formatting

---

## Final Notes

- **Consistency is key**: Use the same spacing, colors, and components throughout
- **User feedback**: Always show loading and success/error states
- **Mobile-first**: Design for mobile, enhance for desktop
- **Performance**: Optimize images, lazy load when possible
- **Test on real devices**: Check responsiveness on actual phones/tablets

**These are guidelines, not strict requirements. Feel free to be creative while maintaining professional quality!**
