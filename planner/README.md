# Household Planner

A minimal household maintenance planner with filter views and task recommendations.

## Features

- **Filter Views**: Four organizational approaches (Frequency, Area, Hybrid, Minimal)
- **Task Recommendations**: Curated list of maintenance items based on selected filter
- **Daily Background Color**: Background hue cycles through the year (365-day color spectrum)
- **Current Date Display**: Shows full date (e.g., "Tuesday 25 November 2025")
- **Clean Layout**: Sidebar navigation with right-aligned recommendation panel
- **Database Ready**: Supabase integration prepared for future data management

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
planner/
├── index.html              # Main HTML structure
├── styles/
│   └── styles.css         # Complete styling
├── scripts/
│   └── script.js          # Date display, background color, filters
├── database/
│   └── supabase-setup.sql # Database schema for future backend
├── docs/
│   └── database-schema.md # Database documentation
├── README.md              # This file
└── .gitignore
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

- Database integration with Supabase (PostgreSQL)
- User authentication
- CRUD operations for maintenance items, rooms, and frequencies
- Task completion tracking with history
- Filtering and sorting by status, priority, due date
- Reminder notifications

## Tech Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend** (Planned): Supabase (PostgreSQL + Authentication + Real-time)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel compatible)

## Database Schema

See `docs/database-schema.md` for complete database structure including:
- Users (Supabase Auth)
- Rooms
- Frequencies
- Maintenance Items

## License

MIT
