import json
from src.entity_extractor import CrimeEntityExtractor
from src.entity_resolver import EntityResolver
from src.graph_engine import CrimeGraphEngine
from src.blockchain_ledger import ChainOfCustodyLedger
from src.graph_visualizer import export_interactive_report

def run_investigation_pipeline():
    extractor = CrimeEntityExtractor()
    resolver = EntityResolver(similarity_threshold=75)
    graph = CrimeGraphEngine()
    ledger = ChainOfCustodyLedger()

    # Pre-register known alias relationships
    resolver.register_canonical("Ramesh Kumar", ["R. Kumar", "Ramesh K."])
    resolver.register_canonical("Sunil Verma", ["Sunil V."])

    print(">>> 1. Ingesting FIR Records...")
    fir_1 = (
        "FIR 101/2026: Complainant was defrauded by Ramesh Kumar operating "
        "Apex Consultancy. Payments routed via phone 9811100001."
    )
    fir_2 = (
        "FIR 404/2026: Cyber extortion ring bust involving Sunil Verma. "
        "Associate R. Kumar spotted using vehicle DL-01-AB-1234 and phone 9822200002."
    )

    ledger.record_event("INGEST_FIR_101", "INSP_VIKRAM_DL", fir_1)
    ledger.record_event("INGEST_FIR_404", "SI_AMIT_HR", fir_2)

    # Ingest FIR 1
    e1 = extractor.extract_from_text(fir_1)
    primary_suspect = resolver.resolve_person("Ramesh Kumar")
    graph.add_entity_node(primary_suspect, "Person")
    graph.add_entity_node("Apex Consultancy", "Organization")
    graph.add_relationship(primary_suspect, "Apex Consultancy", "OPERATES")

    for ph in e1["phones"]:
        graph.add_entity_node(ph, "Phone")
        graph.add_relationship(primary_suspect, ph, "USES")

   # Ingest FIR 2
    e2 = extractor.extract_from_text(fir_2)
    extortion_suspect = resolver.resolve_person("Sunil Verma")
    graph.add_entity_node(extortion_suspect, "Person")

    # FIX: Link Sunil Verma to his extracted phone number(s)
    for ph in e2["phones"]:
        graph.add_entity_node(ph, "Phone")
        graph.add_relationship(extortion_suspect, ph, "USES")

    # Link R. Kumar -> resolves automatically to Ramesh Kumar
    co_suspect = resolver.resolve_person("R. Kumar")
    graph.add_entity_node(co_suspect, "Person")
    graph.add_relationship(extortion_suspect, co_suspect, "ACCOMPLICE")

    for v in e2["vehicles"]:
        graph.add_entity_node(v, "Vehicle")
        graph.add_relationship(co_suspect, v, "DRIVES")

    print(">>> 2. Ingesting Telecom CDR Data...")
    cdr_data = [
        {"caller": "9811100001", "receiver": "9999900000", "count": 18},
        {"caller": "9822200002", "receiver": "9999900000", "count": 14}
    ]
    ledger.record_event("INGEST_CDR", "TELCO_ANALYZER_SYS", json.dumps(cdr_data))

    graph.add_entity_node("Devi Lal", "Person")
    for call in cdr_data:
        graph.add_entity_node(call["caller"], "Phone")
        graph.add_relationship(call["caller"], "Devi Lal", "CALL_FREQUENCY", weight=call["count"])

    print(">>> 3. Computing Graph Metrics (Centrality & Middlemen)...")
    results = graph.compute_investigative_metrics()
    for row in results:
        broker_flag = "[KEY BROKER]" if row['is_stealth_broker'] else ""
        print(f" - [{row['type']}] {row['entity']} | Betweenness: {row['betweenness']} {broker_flag}")

    print(">>> 4. Verifying Blockchain Chain-of-Custody Integrity...")
    is_valid = ledger.verify_integrity()
    print(f"Chain Integrity Status: {'[PASSED] TAMPER-PROOF' if is_valid else '[FAILED]'}")

    # Step 5: Render Interactive HTML Visualizer
    export_interactive_report(graph, "crime_network_report.html")

if __name__ == "__main__":
    run_investigation_pipeline()