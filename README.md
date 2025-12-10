# Websites Platform

A collection of web applications with unified subscription management and shared database infrastructure.

## 🎯 Platform Overview

This platform provides multiple productivity applications under a single subscription model. Subscriptions grant access by number of apps - from one app minimum to all apps maximum. Users authenticate once and access their subscribed apps with a unified account.

**Key Features:**
- 🔐 Single sign-on across all apps
- 💳 Subscription-based app access (1 to 3 apps)
- 🗄️ Shared database infrastructure
- 🔒 Secure data isolation per user
- 📱 Responsive design across all apps

---

## Applications

### 🏠 House Planner
Household maintenance tracking with filter views and intelligent task management.

**Features:**
- Multiple filtering options (Frequency, Area, Hybrid, Minimal)
- Room-based task organization
- Maintenance scheduling with customizable frequencies
- Task priority and status tracking
- Daily color-changing background

**Tech Stack:** HTML, CSS, JavaScript, Supabase (shared database)

[View Project](./house-planner/) | [App README](./house-planner/README.md)

---

### ✅ Habit Tracker
Personal habit tracking with visual progress and streak management.

**Features:**
- Track daily, weekly, and monthly habits
- Categorize habits (Health, Productivity, Mindfulness, Social, Hobbies)
- Visual progress tracking
- Custom habit creation

**Tech Stack:** HTML, CSS, JavaScript

[View Project](./habit-tracker/) | [App README](./habit-tracker/README.md)

---

### 👤 Personal Website
Portfolio and schedule management with custom styling.

**Features:**
- Responsive personal portfolio
- Flip card profile with social links
- Schedule page with weekly view
- Project showcase
- Custom animations and styling

**Tech Stack:** HTML, CSS, JavaScript

[View Project](./personal-website/) | [App README](./personal-website/README.md)

---

## 📋 Subscription Model

Subscriptions are based on the number of apps you want to access:
- **Minimum**: 1 app
- **Maximum**: All 3 apps

Subscribing to apps unlocks additional features within each application.

See [Subscription Tiers](./shared/docs/subscription-tiers.md) for complete details.

---

## 🏗️ Platform Structure

```
Websites/
├── shared/                          # Platform-wide infrastructure
│   ├── database/
│   │   ├── supabase-setup.sql      # Unified database schema
│   │   └── README.md               # Database setup guide
│   └── docs/
│       ├── database-schema.md      # Complete schema documentation
│       └── subscription-tiers.md   # Plan features and pricing
│
├── house-planner/                   # Household maintenance app
│   ├── index.html
│   ├── css/, js/, docs/
│   └── README.md
│
├── habit-tracker/                   # Habit tracking app
│   ├── index.html
│   ├── css/, js/
│   └── README.md
│
├── personal-website/                # Portfolio website
│   ├── index.html
│   ├── schedule.html
│   ├── css/, js/, assets/
│   └── README.md
│
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Quick Start
Open any app's `index.html` file directly in a browser.

### With Local Server
```bash
# Using Python
python -m http.server 8080

# Using PHP  
php -S localhost:8080

# Using VS Code Live Server
# Right-click index.html → Open with Live Server
```

### Database Setup
See [Database Setup Guide](./shared/database/README.md) for instructions.

---

## 🔧 Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive design (mobile-friendly)
- No build process required

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Row Level Security (RLS)
- RESTful API (auto-generated)

**Deployment:**
- Static hosting (GitHub Pages, Netlify, Vercel)
- CDN for assets
- Supabase hosted database

---

## 📚 Documentation

- **[Database Schema](./shared/docs/database-schema.md)** - Complete database documentation
- **[Subscription Tiers](./shared/docs/subscription-tiers.md)** - Plan features and pricing
- **[Database Setup](./shared/database/README.md)** - Setup and migration guide
- **App-Specific Docs** - Each app's README and docs folder

---

## 🔐 Security & Privacy

- **Authentication:** Supabase Auth with JWT tokens
- **Data Isolation:** Row Level Security ensures user data separation
- **Encryption:** HTTPS in transit, encrypted at rest
- **Privacy:** No data sharing between users

## Author

**Maria Șuteu (Zmolsito)**
- GitHub: [@SMara99](https://github.com/SMara99)
- LinkedIn: [Maria Șuteu](https://www.linkedin.com/in/maria-șuteu-b59593243/)
- itch.io: [zmolsito](https://zmolsito.itch.io/)

## License

These projects are part of a personal portfolio. Feel free to explore and learn from the code.
