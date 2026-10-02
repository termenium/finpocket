# FinPocket — Professional Financial Calculators

A fast, private suite of financial calculators built with **Next.js 15 (App Router)**,
**TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Recharts**. Everything runs
client-side — no accounts, no tracking of your inputs, no server-side computation.

## Calculators

| Calculator | Description |
|---|---|
| **SIP** | Systematic Investment Plan growth with inflation adjustment |
| **Lump Sum** | One-time investment future value with compound growth |
| **EMI** | Loan EMI, total interest, and full amortization schedule |
| **CAGR** | Compound Annual Growth Rate with real (inflation-adjusted) returns |
| **XIRR** | Extended IRR for irregular cash flows (Newton-Raphson + bisection solver) |
| **Currency Converter** | Real-time rates with 30-day historical trends (ECB reference data) |
| **Income Tax** | Multi-country slabs & deductions (India, US, UK, Canada, Australia) |

## Features

- **Live calculations** — results update instantly as you drag sliders or type
- **Inflation adjustment** — real purchasing-power values on investment calculators
- **Real exchange-rate history** — ECB daily reference rates via the free Frankfurter API,
  with automatic fallback between rate providers
- **Share exports** — copy results as text, or save as PNG/PDF (lazy-loaded)
- **Dark/light theme**, locale-aware currency formatting (₹ crore/lakh, K/M/B for others)
- **Accessible** — focus-friendly tooltips, `aria-live` result announcements, WCAG zoom

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # static export to out/ (output: 'export')
npm run lint
```

## Deployment

The build produces a **static export** in `out/` (`output: 'export'` in
`next.config.js`), so there is no server to run. `vercel.json` pins the framework,
build command, and that `out/` output directory.

The repo root must be the Vercel project root. In **Project Settings → General**:

| Setting | Value |
|---|---|
| Root Directory | *(leave empty / `.`)* |
| Framework Preset | `Next.js` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `out` |

A Root Directory of `app/` makes the build run in `app/`, where there is no
`package.json`, and the deploy fails with
`The Next.js output directory "out" was not found`. `vercel.json` is read from the
Root Directory, so it cannot correct this setting — it has to be cleared in the
dashboard.

## Data notes

- **Tax slabs** reflect FY 2025-26 (India, UK, Australia) and tax year 2025 (US, Canada)
  as published; verify before filing.
- **Exchange rates** come from [exchangerate-api.com](https://www.exchangerate-api.com)
  with a Frankfurter (ECB) fallback; historical trends are ECB business-day rates.
- Results are estimates for educational purposes — not financial advice.

## License

All rights reserved © FinPocket.
