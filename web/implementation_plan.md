# Dashboard UX Improvements

This plan outlines major functional and UX improvements to the NEXUS dashboard, focusing on investigator-support features, focus modes, AI explanations, and reporting.

## Open Questions
- None. Proceeding with mock data for AI explanations where appropriate, and updating the UI structures as requested.

## Proposed Changes

### Dashboard / Network Explorer (`src/components/GraphExplorer.tsx`)
- **State Additions**:
  - `focusMode`: "Selected Node" | "Direct Links" | "2 Hops" | "All".
  - `hideUnrelated`: boolean toggle to drastically fade out non-focused nodes.
  - `nodePriorities`: mapping of node IDs to "PRIMARY", "SECONDARY", "OTHER".
  - `isAgentModalOpen`: boolean to show the full Intelligence Summary.
- **Canvas Rendering Updates (`draw` method)**:
  - Add logic to calculate which nodes are in focus (0 hops, 1 hop, 2 hops) based on `selectedNode`.
  - Visually fade out (`globalAlpha`) unrelated nodes if `hideUnrelated` is active.
  - Highlight relationship paths visually using red and thicker strokes.
  - Color overrides based on priority: Primary gets strong red, Secondary gets amber, Other gets muted/default.
- **UI Controls**:
  - Add Focus Mode toggle buttons (`Selected Node`, `Direct Links`, `2 Hops`, `All`).
  - Add `Hide unrelated` toggle.
  - Add filter by Priority (`All`, `Primary`, `Secondary`, `Other`).
- **Intelligence Agent Panels**:
  - **In Sidebar**: Add a "WHY THIS MATTERS" mock explanation with a "View Full Analysis" button.
  - **Modal Panel**: An Intelligence Summary modal showing Relevance, Key Connections, Related Cases, and Supporting Records.
  - **Priority Assignment**: Add a dropdown in the sidebar to let the investigator assign Priority (Primary, Secondary, Other).
  - **Connection Reasons**: Update the connections list to include a mock "WHY THIS CONNECTION?" explanation (e.g. "Shared phone number").

### Entity Resolution (`src/app/dashboard/resolve/page.tsx`)
- **Confidence Explanation**:
  - Add an expandable "WHY THIS MATCH?" panel.
  - Show a breakdown table of matching factors (Positive: Name match, Phone match; Negative: Age difference).
  - Add a human-readable agent summary of the match (e.g., "The records use very similar names...").
  - Add clear labels (e.g., "92% - Very Strong Match").

### Reports (`src/app/dashboard/reports/page.tsx`)
- **Report Preview UX**:
  - Remove immediate JSON download.
  - Add a Report Preview view.
  - Provide "Download PDF", "Download HTML", and "Download JSON" options.
  - Add a visually formatted HTML preview mimicking the PDF output structure (Executive Summary, Key Entities, Key Connections, Network Snapshot).

## Verification Plan
### Manual Verification
- Test Network View: Click node -> check focus modes -> toggle "Hide unrelated" -> check priority filters -> open Agent modal.
- Test Match Records: Expand "Why this match?" -> review factors.
- Test Reports: Preview report -> ensure buttons for PDF/HTML exist.
