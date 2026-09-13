# Synthetic Criminal Network Investigation Dataset — 500 Source Records

ALL DATA IS SYNTHETIC and intended only for research, development, demonstrations, and SIH prototyping.
It does not represent real people, criminals, accounts, phone numbers, vehicles, cases, or transactions.

SOURCE RECORDS (exactly 500):
- persons.csv: 100
- phones.csv: 60
- accounts.csv: 40
- calls.csv: 100
- transactions.csv: 80
- vehicles.csv: 40
- case_records.csv: 40
- events.csv: 40

DERIVED/reference files:
- derived_graph_edges.csv — normalized graph edges generated from the 500 source records
- data_dictionary.csv — field-level documentation
- locations_reference.csv — 8 synthetic locations

DESIGNED DEMO BEHAVIOR:
- 8 synthetic communities
- P020, P040, P060 and P080 are intentionally placed as bridge candidates
- Cross-community calls and financial transfers exist
- Calls, transactions, vehicles, cases and events share identifiers so entity resolution can connect them
- The graph should surface bridge/high-centrality entities
- The data supports explainable evidence trails using source_record_id

Recommended pipeline:
1. Load all source CSVs.
2. Resolve person/phone/account/vehicle/case/event identifiers.
3. Build a knowledge graph using derived_graph_edges.csv.
4. Run degree, betweenness, PageRank and community detection.
5. Detect bursts, cross-community links and unusual transaction chains.
6. For every alert, show the underlying source_record_id values.

Important:
NCRB aggregate datasets are useful as a separate contextual/statistical layer; they do not establish person-to-person relationships.
This synthetic relational layer is the core demonstration data for network discovery.
