# Motivational Progressbar

A tiny Node.js/Express app that renders progress bars and percentages for:
- **Year progress** (how much of the current year has passed)
- **Custom date range** (start → end)
- **Life progress** (based on DOB and expected lifespan)

HTML responses for browsers and JSON for programmatic use.

---

## Features
- Endpoints: `/` (HTML) and `/json`
- Query modes:
  - `?startdate=MMDDYYYY&enddate=MMDDYYYY`
  - `?dob=MMDDYYYY&age=NUMBER`
  - no params → current year progress
- Timezone-aware via server time

## Quick Start (Local)
```bash
npm install
node app/percentage_year.js
# open http://localhost:3000
