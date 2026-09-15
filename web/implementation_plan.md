# Landing Page Visual Overhaul & De-AI-ification

The goal is to eliminate the "AI Startup Template" aesthetic (excessive cards, generic grids, decoration for decoration's sake) and replace it with a professional, editorial, intelligence-analysis product design.

## Proposed Changes

### 1. Structure Reorganization (`src/app/page.tsx`)
Merge `Capabilities.tsx` and `CapabilityShowcases.tsx` into a single, story-driven section called `ProductStory.tsx`. This enforces the user's requested storytelling flow and eliminates the redundant grid-of-cards pattern.
Flow:
- Hero -> StatBand -> Problem -> Pipeline -> ProductStory -> HumanInTheLoop -> DashboardPreview (new) -> Responsible -> FinalCTA

### 2. Storytelling Sequence (`src/components/ProductStory.tsx`)
Replace the bento grids with a linear, split-layout story where each step has a distinct visual:
- **Step 1: Information is scattered** (Show unstructured text vs extracted entities in a sleek code-like view).
- **Step 2: NEXUS finds possible matches** (Show a clear diagram of two records merging, not a floating card).
- **Step 3: NEXUS builds the network** (Show the ASCII-style or minimalist graph diagram `PERSON -> PHONE -> VEHICLE`).
- **Step 4: The investigator explores** (Show the realistic network path finding).
- **Step 5: The investigator reviews evidence** (Show a clean timeline/ledger view).

### 3. Diagrammatic Visuals (No Fluff)
- Remove glowing blobs, blurred backgrounds, and purely decorative borders.
- Replace generic "icons in boxes" with hard data visualizations, ASCII-style relationship trees, and annotated UI fragments.
- Use strict, minimal CSS: `border-black`, `border-[#d4d4d4]`, sharp corners, high contrast typography.

### 4. Intentional Color Usage
- Body text remains mostly neutral (`#0a0a0a`, `#737373`).
- **Red (`#ff3d00`)**: Used strictly for NEXUS brand moments, active highlights, and primary nodes.
- **Amber (`#d97706`)**: Used for "Needs Review" or "Match Confidence < 100%".
- **Blue (`#2563eb`) / Teal (`#0d9488`)**: Used selectively in network diagrams to differentiate entity types (Person vs Phone).
- **Green (`#16a34a`)**: Used for "Resolved" or "Verified".

### 5. Asymmetric Layouts & Hierarchy
- Remove the uniform `grid-cols-3` or `grid-cols-4` patterns.
- Use `lg:grid-cols-12` with asymmetrical splits (e.g., text spans 4 cols, visualization spans 8 cols).
- Introduce strong typographic hierarchy (huge numbers, tiny metadata labels).

## Verification Plan
1. Ensure the landing page feels like an Apple/Palantir-style enterprise product, not a generic SaaS template.
2. Verify all animations feel purposeful (e.g., a line drawing between two nodes) rather than generic (everything sliding in at once).
3. Confirm that removing `Capabilities.tsx` and `CapabilityShowcases.tsx` doesn't lose technical detail, but presents it better.
