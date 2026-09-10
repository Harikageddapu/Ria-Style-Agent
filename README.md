# Ria Style Agent

An AI-powered fashion analysis and editorial styling application that analyzes clothing imagery, generates campaign-grade style guides, matches garments to catalog pieces, and verifies geographic market availability.

---

## Features

- **AI Vision Garment Analysis (`POST /api/vision`)**:
  - Automatically identifies garment silhouettes, primary colors, complementary palettes, undertones, materials, and occasion suitability.
  - Multi-tier resilience engine with automatic exponential backoff and failover across Gemini models (`gemini-3.8-flash`, `gemini-flash-latest`, `gemini-3.1-flash-lite`).

- **Editorial Style Recommendations (`POST /api/style`)**:
  - Generates bespoke styling directives in an avant-garde European lookbook voice.
  - Formulates day-to-night transitions, silhouette balance recommendations, accessory advice (shoes, bags, jewelry, eyewear), and occasion scenarios.

- **Collection Product Matching (`POST /api/products/match`)**:
  - Matches analyzed items to high-fashion collection pieces using similarity scoring based on color harmony, garment type, and styling aesthetics.
  - Supports live RapidAPI Zara Data API integration when credentials are provided, alongside high-fidelity curated catalog data.

- **Geographic Availability Engine (`POST /api/products/geo`)**:
  - Real-time stock and market filtering across key fashion capitals (US, UK, EU/Spain, Asia/Japan).

- **Modern Multi-Modal Studio Interface**:
  - Live device camera scanner with graceful permission handling.
  - Drag-and-drop photo uploader.
  - Instant one-click test drive with curated editorial looks (Tailored Wool Blazer, Satin Slip Dress, Gabardine Trench, Wide-Leg Trousers).
  - High-fashion dark aesthetic with smooth transitions powered by `motion`.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Express (Node.js / TypeScript with `tsx` & `esbuild`)
- **AI / Vision**: `@google/genai` (Gemini Flash multimodal vision & structured JSON schemas)
- **Tooling**: Vite 6, tsx

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, agent status, and active API capabilities |
| `GET` | `/api/regions` | Supported geographic fashion regions and currencies |
| `GET` | `/api/catalog` | Active seasonal collection catalog |
| `POST` | `/api/vision` | Analyzes uploaded image base64 or URL (returns garment type, palette, fit, material) |
| `POST` | `/api/style` | Generates editorial styling directives, accessory advice, and day-to-night transitions |
| `POST` | `/api/products/match` | Matches analyzed garments to collection pieces with similarity scoring |
| `POST` | `/api/products/geo` | Filters catalog products by geographic region availability and stock |

---

## Setup & Local Development

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Gemini API Key (Required for server-side AI analysis)
GEMINI_API_KEY="your-gemini-api-key"

# RapidAPI Key (Optional: enables live Zara Data API lookups)
RAPIDAPI_KEY=
RAPIDAPI_HOST="zara-data-api.p.rapidapi.com"
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 4. Production Build & Start

```bash
npm run build
npm start
```

---

## Project Structure

```text
ria-style-agent/
├── server.ts                  # Express server entry point & API route handlers
├── server/
│   ├── gemini.ts              # Gemini client initialization & retry/fallback engine
│   ├── vision_agent.ts        # Multimodal image analysis agent
│   ├── style_agent.ts         # Editorial styling recommendation agent
│   └── zara_api.py / zara_api.ts # Product matching & RapidAPI client
├── src/
│   ├── App.tsx                # Main application orchestrator & tabs
│   ├── components/
│   │   ├── Header.tsx         # Ria navigation and region selector
│   │   ├── ImageUploader.tsx  # Camera scanner & drag-and-drop uploader
│   │   ├── VisionResults.tsx  # Color palette & garment breakdown display
│   │   ├── StyleGuideSection.tsx # Editorial styling suggestions
│   │   └── ZaraMatchesSection.tsx # Collection matching cards & pricing
│   ├── data/
│   │   └── zaraCatalog.ts     # Curated seasonal catalog & geographic data
│   └── types.ts               # Shared TypeScript schemas & interfaces
├── metadata.json              # Platform application manifest
└── package.json               # Dependencies and build scripts
```

---

## License

MIT License.
