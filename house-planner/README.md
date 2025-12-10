# Household Planner

A minimal household maintenance planner with filter views and task recommendations.

## Features

- **Filter Views**: Four organizational approaches (Frequency, Area, Hybrid, Minimal)
- **Task Recommendations**: Curated list of maintenance items based on selected filter
- **Daily Background Color**: Background hue cycles through the year (365-day color spectrum)
- **Current Date Display**: Shows full date (e.g., "Tuesday 25 November 2025")
- **Clean Layout**: Sidebar navigation with right-aligned recommendation panel
- **Shared Database**: Uses platform-wide database with subscription-based access (see `../shared/database/`)

## Getting Started

### Open Directly
Simply open `index.html` in your web browser. No build process or dependencies required.

### Use a Local Server (Optional)
```bash
# Using Python
python -m http.server 8080

# Using PHP
php -S localhost:8080

# Using VS Code Live Server extension
Right-click index.html → Open with Live Server
```

Then navigate to `http://localhost:8080` in your browser.

## Project Structure

```
house-planner/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css         # Complete styling
├── js/
│   └── script.js          # Date display, background color, filters
├── docs/
│   └── database-schema.md # Original schema docs (see ../shared/database/ for current)
├── README.md              # This file
└── .gitignore

../shared/                  # Platform-wide resources
├── database/
│   ├── supabase-setup.sql # Unified database schema
│   └── README.md
└── docs/
    ├── database-schema.md      # Complete schema documentation
    └── subscription-tiers.md   # Subscription plan details
```

## How to Use

1. **Select a Filter**: Click one of the four filter buttons in the left sidebar
   - **Frequency**: Group tasks by maintenance frequency (daily, weekly, monthly, etc.)
   - **Area**: Group tasks by room/location
   - **Hybrid**: Combined frequency and area organization
   - **Minimal**: Simplified essential tasks only

2. **View Recommendations**: The right panel shows recommended tasks based on your selected filter

3. **Background Color**: Changes daily based on the day of the year for visual variety

## Future Features

- Database integration with shared Supabase database
- Subscription-based feature access
- User authentication via platform-wide auth
- CRUD operations for maintenance items, rooms, and frequencies
- Task completion tracking with history
- Filtering and sorting by status, priority, due date
- Reminder notifications
- Subscription limit enforcement (rooms, items based on plan)

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time) - Shared across all platform apps
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel compatible)

## Database Schema

See `../shared/docs/database-schema.md` for the complete unified database design, including:
- **Subscription Management**: Plans, user subscriptions, app access control
- **User Authentication**: Supabase Auth integration
- **House Planner Tables**: Rooms, frequencies, maintenance items
- **Row Level Security**: Data isolation per user
- **Feature Limits**: Subscription-based access control

Quick reference: `docs/database-schema.md` (original house-planner specific docs)
- Maintenance Items
