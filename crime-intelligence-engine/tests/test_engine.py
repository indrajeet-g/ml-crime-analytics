import pytest
from src.entity_extractor import CrimeEntityExtractor
from src.entity_resolver import EntityResolver
from src.graph_engine import CrimeGraphEngine
from src.blockchain_ledger import ChainOfCustodyLedger

def test_entity_extraction_and_cleaning():
    extractor = CrimeEntityExtractor()
    sample = "Call made to +91 98111 00001 regarding car DL 04 AB 4321."
    entities = extractor.extract_from_text(sample)
    
    assert "9811100001" in entities["phones"]
    assert "DL04AB4321" in entities["vehicles"]

def test_entity_resolution():
    resolver = EntityResolver(similarity_threshold=80)
    resolver.register_canonical("Ramesh Kumar", ["R. Kumar", "Ramesh K."])
    
    assert resolver.resolve_person("Ramesh K.") == "Ramesh Kumar"
    assert resolver.resolve_person("r. kumar") == "Ramesh Kumar"

def test_broker_detection():
    engine = CrimeGraphEngine()
    # Path graph: A <-> B <-> C. B is the critical bridge.
    engine.add_entity_node("A", "Person")
    engine.add_entity_node("B", "Person")
    engine.add_entity_node("C", "Person")
    engine.add_relationship("A", "B", "COMMUNICATED")
    engine.add_relationship("B", "C", "COMMUNICATED")
    
    metrics = {m["entity"]: m for m in engine.compute_investigative_metrics()}
    assert metrics["B"]["betweenness"] > metrics["A"]["betweenness"]
    assert metrics["B"]["betweenness"] > metrics["C"]["betweenness"]

def test_tamper_evident_ledger():
    ledger = ChainOfCustodyLedger()
    ledger.record_event("UPLOAD", "OFFICER_1", "FIR Data")
    ledger.record_event("QUERY", "OFFICER_2", "Search Suspect")
    assert ledger.verify_integrity() is True

    # Tamper test
    ledger.chain[1].action = "MODIFIED_UNAUTHORIZED"
    assert ledger.verify_integrity() is False