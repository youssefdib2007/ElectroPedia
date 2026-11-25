# ElectroPedia — موسوعتك الشاملة في عالم الكهرباء والإلكترونيات

**Slogan:** `Explore. Learn. Connect.`  
**Free & Open Access:** 100% free educational platform — no sign-up or account required.

ElectroPedia is a trilingual (**Arabic AR [Default RTL] · English EN · French FR**) educational web platform covering electrical and electronic components, real hardware appearance, IEC 60617 & ANSI/IEEE Std 315 schematic symbols, zoomable wiring diagrams, interactive quizzes, spaced-repetition flashcards, electrical engineering calculators, safety procedures, and real client-side study analytics for beginners, vocational students (**BP / BT / TS / LT**), engineering students, and practicing electricians.

---

## Creator Story

Built by a 2nd-year **BT2 Residential Electricity** student at **Jabal Mohsen Technical Institute** (*معهد جبل محسن الفني*) to help fellow learners connect Arabic, English, and French electrical terminology, recognize physical components and symbols accurately, and apply safe practical engineering principles.

---

## Implemented Features (Phase 1 & Phase 2)

### Phase 1 — Core Encyclopedia & Catalog
- **7 Encyclopedia Categories & 69 Standardized Components:**
  - Residential Electricity (`11`) · Industrial Electricity (`10`) · Electronics (`13`) · Electric Motors (`9`) · Automation (`7`) · Renewable Energy (`7`) · Electrical Tools (`12`)
- **Standalone Component Detail Pages (`#/component/<id>`):**
  - Trilingual nomenclature & alternative names (`altNames`)
  - 5-tab visual showcase (Studio Photo, Physical Geometry, IEC/IEEE Symbol, Educational Wiring Diagram, Internal/External Anatomy)
  - Core function, working principle, variants, terminal pinouts, electrical specs, common faults, safe testing methods, safety rules, references, related component links, and `model3d` schema metadata
- **Smart Search & Filtering:**
  - Trilingual normalization (Arabic diacritics/alef/teh-marbuta & Latin accents)
  - Alternative-name, partial, and typo-tolerant fuzzy matching + live autocomplete suggestions
  - Filter by Category & Difficulty (`Beginner`, `Intermediate`, `Advanced`) and Sort

### Phase 2 — Interactive Study, Engineering Tools & Local Analytics
1. **Interactive Quizzes (`#/quizzes`):**
   - Multiple-choice (by photo, symbol, function), True/False, photo-to-name matching, trilingual AR/EN/FR term matching, electrical calculations, and safety questions
   - Configurable category, difficulty, question count, random shuffling, live progress bar, detailed answer explanations, and persistent local quiz history
2. **Spaced-Repetition Flashcards (`#/flashcards`):**
   - Clean 3D flip cards (Front: component photo or symbol; Back: AR/EN/FR names, function, short summary)
   - Shuffle, filter by category/level/due/difficult/saved, SM-2 spaced repetition ratings (`Again`, `Hard`, `Good`, `Easy`) saved locally
3. **18 Electrical Calculators (`#/calculators`):**
   - Ohm's Law, Electrical Power, Energy Consumption, Electricity Cost, Resistor Color Code (with SVG resistor graphic), Series Resistance, Parallel Resistance, Capacitor, Voltage Divider, Voltage Drop, Cable Size, Transformer, Motor Power, Three-Phase Power, Power Factor, Solar Panel, Battery Capacity, and Electrical Unit Converter — each with formulas, step-by-step math, and engineering notes
4. **Electrical Symbols Library (`#/symbols`):**
   - **39 crisp SVG symbols across 9 domains** (Residential, Industrial, Electronics, Motors, Measuring, Protection, Automation, Earthing, Power Sources)
   - Toggle between **IEC 60617** and **ANSI/IEEE Std 315** vector representations with trilingual names, function notes, and direct links to catalog components
5. **Wiring Diagrams Library (`#/wiring-diagrams`):**
   - **11 zoomable (`75%–250%`) SVG circuits across 8 categories** (Lighting, Series & Parallel, DC Circuits, Control, Relays, Contactors, Motors, Basic Electronics) with bill of components, symbol legends, technical explanations, and safety precautions
6. **Trilingual Electrical Glossary (`#/glossary`):**
   - Searchable and alphabetically filterable dictionary of core electrical terms & abbreviations (`AC`, `DC`, `RCD`, `VFD`, `MPPT`, `PLC`, etc.) with related component links
7. **Favorites Page (`#/favorites`) & Saved Drawer:**
   - Save/unsave components from catalog cards and detail views; search, filter, switch visual modes, and manage favorites with React confirmation modals
8. **Learning Progress Dashboard (`#/progress`):**
   - Tracks **100% real local student interactions** starting at `0` on fresh browsers: studied components, completed quizzes, average & best scores, saved/due/difficult flashcards, breakdown charts across all 7 categories & 3 difficulty levels, and activity timeline
9. **Expanded Occupational Safety (`#/safety`):**
   - Covers IEC 61010 CAT II/III/IV, 5-step LOTO & VAT procedure, IEC 60479-1 electric shock current thresholds (`1–100+ mA`), Short Circuit vs Overload fault comparison, TT / TN / IT earthing systems, IEC 60900 1000V insulated tools & PPE, workshop rules, and ERC/OSHA first aid protocol
10. **Local-Only Persistence & JSON Backup Portability (`#/progress`):**
    - Stored exclusively on the student's device via `localStorage` and `IndexedDB` (zero accounts or external servers)
    - **Export JSON**, validated **Import JSON**, and **Reset All Data** with an accessible confirmation dialog

### Phase 3 — ElectroPedia Virtual Electrical & Electronics Lab (`#/virtual-lab`)
1. **Interactive Schematic CAD Workspace:**
   - Custom crisp SVG schematic workspace with `20px` Snap-to-Grid, Zoom (`35%–220%`), Pan, Marquee & Multi-Select, Drag & Drop + click-to-place palette, Rotate (`90°`), Copy/Paste, Delete, Undo/Redo, and animated orthogonal current-flow paths proportional to solved branch current
   - Interactive double-click toggling for Switches, Push Buttons (NO/NC), and Circuit Breakers
2. **34 Modeled Components across 5 Categories:**
   - **Sources:** DC Battery (with configurable internal resistance), DC Source, AC Source (`RMS` & `Hz`), DC Current Source, Ground (`0V`)
   - **Electrical & Protection:** SPST Switch, Push Button (NO/NC), Lamp, Fuse (automatic overcurrent blow), MCB Circuit Breaker (automatic trip)
   - **Industrial & Motors:** Electromagnetic Relay, Contactor (coil + main `L1-T1` + aux `13-14` NO + `21-22` NC), On-Delay Timer (`TON`), Thermal Overload (`95-96` trip), AC Transformer, Electric Motor (RPM & FWD/REV direction), PLC Unit (`I1/I2 -> Q1/Q2` deterministic Ladder scan)
   - **Electronics & Logic:** Fixed Resistor, Potentiometer, Capacitor, Inductor, PN Diode, LED (5 colors + overcurrent warning), Zener Diode, NPN BJT, N-Ch MOSFET, Digital Logic Gates (`AND/OR/NOT/NAND/XOR`), Op-Amp
   - **Virtual Measuring Instruments:** Voltmeter (`10MΩ`), Ammeter (`0.01Ω`), Ohmmeter (de-energized test current + live voltage safety warning), Digital Multimeter, Power Meter (Wattmeter), 2-Channel SVG Oscilloscope (`CH1 / CH2`)
3. **Real MNA Simulation Engine & Web Worker (`src/utils/labEngine.ts`, `src/workers/simWorker.ts`):**
   - Modified Nodal Analysis (Gaussian elimination with partial pivoting) solving Ohm's Law, KCL, KVL, series/parallel networks, open/short/unsolvable circuits, Backward-Euler RC/RL transients, AC RMS & instantaneous 2-cycle scope sweeps, piecewise/iterative nonlinear semiconductors, relay latching, and PLC Ladder execution
4. **11 Educational Templates & Local IndexedDB Projects:**
   - Pre-built guided experiments (Battery & Lamp, Series, Parallel, Voltage Divider, LED + Resistor, RC Transient, Relay Control, Start/Stop Self-Holding Contactor, Digital Logic Gate, AC Transformer + Rectifier, PLC Ladder Motor Control) with Theory, Expected Values, and Self-Check Questions
   - Full IndexedDB project CRUD (New, Save, Rename, Duplicate, Delete, Auto-Save, Export JSON, Validated Import JSON)
5. **Engineering Model Boundaries & Safety Notice:**
   - Calculations use simplified educational single-phase/piecewise models (not full SPICE nonlinear thermal or 3-phase FEA motor physics); simulated results never guarantee real-world circuit safety.

---

## Tech Stack

- **UI Framework:** React 19 + TypeScript + Vite 8
- **Styling & UI:** Tailwind CSS v4 + shadcn/ui + Lucide Icons + Motion
- **Persistence:** Browser `localStorage` & `IndexedDB` (exported/imported via schema v1 JSON)
- **Simulation:** Modified Nodal Analysis (MNA) running in a dedicated Web Worker
- **Testing:** Node built-in test runner (`tsx --test`) + Playwright headless E2E verification

---

## Project Structure

```text
├── public/
│   ├── robots.txt                     # Crawler directives pointing to /sitemap.xml
│   └── sitemap.xml                    # Sitemap covering core, Phase 2 & Virtual Lab routes + 69 components
├── src/
│   ├── assets/images/                 # Real electrical & electronic hardware photography
│   ├── components/
│   │   ├── calculators/               # Resistor SVG, Calculator diagrams & modular inputs
│   │   ├── lab/                       # Virtual Lab SVG symbols, Canvas, Palette, Toolbar, Inspector & Modals
│   │   ├── ComponentArtwork.tsx       # Physical shape & IEC schematic vector renderers
│   │   ├── ComponentCard.tsx          # Catalog card with real photo / symbol toggle & favorite button
│   │   ├── ComponentDetailPage.tsx    # Standalone component datasheet page
│   │   ├── FlashcardsDeck.tsx         # 3D flip flashcards with SM-2 spaced repetition
│   │   ├── Navbar.tsx / Footer.tsx    # Responsive trilingual RTL/LTR navigation shell
│   │   ├── QuizEngine.tsx             # Configurable multi-mode quiz runner & history
│   │   ├── SavedDrawer.tsx            # Quick favorites slide-over drawer
│   │   ├── SymbolSvgRenderer.tsx      # Dual IEC / ANSI vector symbol renderer
│   │   ├── WiringDiagramArtwork.tsx   # Component-level schematic SVG renderer
│   │   └── WiringLibrarySvg.tsx       # Interactive zoomable wiring diagram SVG library
│   ├── data/
│   │   ├── catalog/                   # 7 modular category datasets (69 items)
│   │   ├── componentsData.ts          # Aggregated catalog, categories & starter quiz items
│   │   ├── glossaryData.ts            # Trilingual electrical glossary entries
│   │   ├── labCatalog.ts              # 34 Virtual Lab component specifications & pin coordinates
│   │   ├── labTemplates.ts            # 11 guided educational circuit templates
│   │   ├── quizQuestionsData.ts       # Handcrafted calculation, safety & conceptual quiz bank
│   │   ├── symbolsData.ts             # 9-domain IEC / ANSI electrical symbols dataset
│   │   └── wiringLibraryData.ts       # 8-category zoomable wiring circuits dataset
│   ├── i18n/
│   │   ├── I18nContext.tsx            # Locale & RTL/LTR state provider
│   │   └── messages.ts                # Complete AR / EN / FR translation dictionaries
│   ├── pages/
│   │   ├── AboutPage.tsx / ContactPage.tsx
│   │   ├── CalculatorsPage.tsx        # 18 engineering calculators workspace
│   │   ├── CategoriesPage.tsx / DomainShowcasePage.tsx
│   │   ├── FavoritesPage.tsx          # Dedicated saved components manager
│   │   ├── FlashcardsPage.tsx / QuizzesPage.tsx
│   │   ├── GlossaryPage.tsx           # Searchable A-Z trilingual glossary
│   │   ├── ProgressPage.tsx           # Real local analytics & JSON Export/Import/Reset
│   │   ├── SafetyPage.tsx             # Expanded industrial & residential electrical safety
│   │   ├── SymbolsPage.tsx            # Dual-standard IEC/ANSI symbols library
│   │   ├── VirtualLabPage.tsx         # Phase 3 Virtual Electrical & Electronics Lab
│   │   └── WiringDiagramsPage.tsx     # Zoomable wiring diagrams library
│   ├── utils/
│   │   ├── calculatorEngine.ts        # Engineering formulas for all 18 calculators
│   │   ├── catalogFilter.ts           # Smart trilingual search, fuzzy matching & sorting
│   │   ├── flashcardEngine.ts         # SM-2 spaced repetition interval logic
│   │   ├── labEngine.ts               # MNA circuit solver, transient RC/RL & PLC Ladder scan
│   │   ├── labStorage.ts              # IndexedDB lab projects persistence & JSON validator
│   │   ├── progressEngine.ts          # Real local analytics, symbol & glossary filters
│   │   ├── quizEngine.ts              # Dynamic quiz generator & grading engine
│   │   ├── routes.ts                  # Hash & path route parser / builder
│   │   ├── sitemap.ts                 # XML sitemap generator utility
│   │   └── storage.ts                 # LocalStorage & IndexedDB persistence + backup I/O
│   └── workers/
│       └── simWorker.ts               # Web Worker offloading MNA circuit simulation
└── package.json
```

---

## Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run all unit tests (catalog, calculators, quiz, flashcards, progress, symbols, glossary, routes, sitemap)
npx tsx --test src/utils/*.test.ts

# Type check (TypeScript)
npm run lint

# Build production bundle (outputs to dist/)
npm run build
```
