# Vizier - Healthcare Analytics Platform

Vizier is a modern healthcare analytics platform that transforms complex clinical data into conversational insights. Built for hospital administrators, clinical directors, and healthcare executives.

## Features

- **Conversational AI**: Ask questions in natural language and get instant insights with visualizations
- **Demo Mode**: Explore with sample healthcare data (12,847 patients, 47,293 encounters) - no signup required
- **Dashboard**: Save and track your most important insights
- **Data Upload**: Support for CSV exports from Epic, Cerner, Allscripts, and most EHR systems
- **Charts & Visualizations**: Bar, line, pie, donut charts, and data tables
- **Export**: Download data as CSV for further analysis

## Tech Stack

- **Framework**: React 18.2 + TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts 2.10
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/piyooshrai/Vizier.git
cd Vizier

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
VITE_API_URL=https://vizier-dev.the-algo.com
VITE_ENV=development
```

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication forms
│   ├── common/       # Reusable UI components
│   ├── conversation/ # Chat interface & charts
│   ├── dashboard/    # Dashboard components
│   ├── layout/       # App layout & navigation
│   └── upload/       # File upload components
├── contexts/         # React contexts (Auth, Toast, Theme)
├── data/             # Mock data for demo mode
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API services
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Demo Mode

Click "Try Demo (No signup required)" on the login page to explore Vizier with sample healthcare data. Demo mode includes:

- Sample patient data from 12,847 patients
- 47,293 encounters across 2 years
- Pre-built insights and visualizations
- Full conversational AI capabilities

## Pages

- `/login` - User authentication
- `/signup` - New user registration
- `/forgot-password` - Password recovery
- `/dashboard` - Saved insights & overview
- `/insights` - Conversational AI interface
- `/upload` - Data upload flow
- `/profile` - User profile & settings
- `/settings` - Organization settings

## API Integration

Vizier connects to a FastAPI backend for:

- User authentication (`/auth/*`)
- Data pipeline processing (`/pipeline/*`)
- Conversational AI queries (`/vanna/*`)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

---

Built with care for healthcare professionals.
