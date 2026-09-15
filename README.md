# NEXUS — Criminal Network Intelligence Platform

**Smart India Hackathon 2026 · Problem Statement 26189 · NCRB**

NEXUS turns scattered investigative records — FIRs, call detail records (CDRs), financial transactions, vehicle and case data — into one explorable network, so investigators can see how people, phones, accounts, and vehicles connect across cases. Every automated match is surfaced for human review, and every ingested record is written to a tamper-evident chain-of-custody ledger.

The repo has two working parts and one dataset:

| Part | What it is |
|---|---|
| [`crime-intelligence-engine/`](#crime-intelligence-engine-python) | Python pipeline: extracts entities from free text, resolves aliases, builds a graph, scores it, and renders it as an interactive HTML report |
| [`web/`](#web-nextjs-dashboard) | Next.js product site + dashboard UI ("NEXUS") demonstrating the ingest → resolve → network → evidence workflow |
| [`Synthetic_Criminal_Network_Dataset_500_Records/`](#dataset) | 500 synthetic records used to demo entity resolution and network analysis at scale |

> All investigative content in this repo (FIRs, names, phone numbers, transactions) is **synthetic**, generated for demo purposes. It does not represent real people or real cases.

## Repository Structure

```
ml-crime-analytics/
├── .claude/                                        # Claude Code run configurations
├── Synthetic_Criminal_Network_Dataset_500_Records/ # 500-record synthetic dataset + docs
├── crime-intelligence-engine/                      # Python: extraction, resolution, graph, ledger
│   ├── src/
│   │   ├── entity_extractor.py                     # spaCy NER + regex (phone/vehicle/bank patterns)
│   │   ├── entity_resolver.py                      # Fuzzy alias resolution (thefuzz)
│   │   ├── graph_engine.py                         # NetworkX graph + centrality/broker scoring
│   │   ├── graph_visualizer.py                     # Renders the graph via pyvis
│   │   └── blockchain_ledger.py                    # Hash-chained chain-of-custody ledger
│   ├── tests/test_engine.py                        # Pytest suite
│   ├── data/                                       # Sample FIR + CDR fixtures
│   ├── run_demo.py                                 # End-to-end demo entry point
│   └── requirements.txt
├── web/                                            # Next.js 15 / React 19 app ("NEXUS")
│   └── src/app, src/components, src/data           # Landing page + dashboard (ingest/extract/resolve/network/evidence/reports)
├── lib/                                            # pyvis/vis-network static assets (generated)
├── crime_network_report.html                       # Sample generated network report (open directly in a browser)
├── .gitattributes
└── .gitignore
```

## `crime-intelligence-engine/` (Python)

The core pipeline, run end-to-end by `run_demo.py`:

1. **`CrimeEntityExtractor`** (`entity_extractor.py`) — runs spaCy NER (`en_core_web_sm`) for people/orgs/locations, plus regex tuned for Indian records to pull phone numbers, vehicle registrations, and bank account numbers out of free text (FIRs, memos).
2. **`EntityResolver`** (`entity_resolver.py`) — merges aliases into one canonical identity using fuzzy string matching (`thefuzz`), e.g. resolving `"R. Kumar"` → `"Ramesh Kumar"`.
3. **`CrimeGraphEngine`** (`graph_engine.py`) — builds a weighted `networkx` graph of entities and relationships, then computes betweenness centrality, PageRank, and degree. It flags a **stealth broker** whenever betweenness `> 0.25` *and* degree `≤ 3` — i.e. an entity that bridges otherwise separate clusters without being an obviously central hub.
4. **`ChainOfCustodyLedger`** (`blockchain_ledger.py`) — a SHA-256 hash-chained ledger (genesis block + linked blocks) that records every ingest event and can verify whether the chain has been tampered with.
5. **`export_interactive_report`** (`graph_visualizer.py`) — renders the graph as an interactive `pyvis`/vis-network HTML file, color-coded by entity type, with node size driven by betweenness and a red "🚨" highlight on flagged brokers.

### Setup & run

```bash
cd crime-intelligence-engine
pip install -r requirements.txt
python -m spacy download en_core_web_sm

python run_demo.py
```

Running the demo ingests two sample FIRs and a small CDR batch, prints the computed centrality/broker table and ledger integrity check to the console, and writes an interactive report to `crime_network_report.html`.

### Tests

```bash
pytest tests/ -v
```

Covers entity extraction/cleaning, alias resolution, broker detection on a toy path graph, and ledger tamper detection. This same command runs in CI on every push/PR to `main` via `.github/workflows/test.yml` (Python 3.11).

## `web/` (Next.js dashboard)

A Next.js 15 / React 19 / Tailwind 4 app that presents NEXUS as a product: a landing page (problem framing, pipeline explainer, "how it works") plus a dashboard with **Ingest**, **Extract**, **Resolve**, **Network**, **Evidence**, and **Reports** views, and a mock (client-side only) **Login** page.

Notes on how it's wired, so expectations are accurate:
- The dashboard's network graph and stats are read from a **precomputed** `src/data/network.json` (derived from the same 500-record synthetic dataset — 287 nodes, 480 edges, 8 communities). It does not call the Python engine at runtime; there's no API layer connecting the two.
- The **Extract** page's live demo (`LiveExtractor.tsx`) ports the same phone/vehicle regex from `entity_extractor.py` into TypeScript so it can run in-browser; person/org detection is approximated with a capitalized-word heuristic there, since spaCy can't run client-side.
- **Login** is a demo role picker (Investigator/Admin) that redirects straight to `/dashboard` — there's no real authentication.

### Setup & run

```bash
cd web
npm install

npm run dev            # http://localhost:4310
# or
npm run build && npm run start   # production build
npm run start:preview            # preview server on :4311
```

Requires Node.js 18.18+ (Next.js 15's minimum).

## Dataset

`Synthetic_Criminal_Network_Dataset_500_Records/` — exactly 500 synthetic source records, purpose-built to demo entity resolution and network discovery:

| File | Records | Notes |
|---|---|---|
| `persons.csv` | 100 | includes `community_id` and an `is_bridge_candidate` flag |
| `phones.csv` | 60 | |
| `accounts.csv` | 40 | |
| `calls.csv` | 100 | synthetic CDRs |
| `transactions.csv` | 80 | synthetic financial transfers |
| `vehicles.csv` | 40 | |
| `case_records.csv` | 40 | 8 crime types × 5 cases each |
| `events.csv` | 40 | synthetic surveillance/meeting events |

Plus reference/derived files: `derived_graph_edges.csv` (480 normalized edges), `data_dictionary.csv` (field-level docs), `locations_reference.csv` (8 locations), and `manifest.json`.

The dataset is deliberately built around **8 synthetic communities** with four entities (`P020`, `P040`, `P060`, `P080`) planted as cross-community bridge candidates, so a correct pipeline should surface them as high-betweenness / broker entities — this is what `web/src/data/network.json`'s precomputed stats reflect (density 0.011, avg. degree 3.18, 3 connected components).

## Generated / vendored files

- **`lib/`** — `pyvis`'s bundled vis-network JS/CSS assets, required by any HTML report `graph_visualizer.py` produces.
- **`crime_network_report.html`** (repo root) — a sample report generated by `run_demo.py`. Open it directly in a browser to see the pipeline's output without running anything.

Both are listed in `crime-intelligence-engine/.gitignore` as regenerated build output; the copies at the repo root are committed so the demo is viewable without running the pipeline first.

## `.claude/`

`launch.json` defines three local run configurations for use with Claude Code / editor tooling: a static file server for previewing the report (`:8010`), the Next.js dev server (`nexus-web`, `:4310`), and a production preview server (`nexus-prod`, `:4311`).

## Disclaimer

This is a hackathon prototype built entirely on **synthetic data** (see the dataset's own README for the full disclaimer). It is not a validated or deployed law-enforcement system, and any "risk," "broker," or "stealth" classifications are heuristic outputs of a demo scoring rule — not findings about real people.

## License

No license file is currently included. If you plan to open-source this or accept outside contributions, add one (e.g. MIT) via GitHub's license picker.
