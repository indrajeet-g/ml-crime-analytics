from thefuzz import fuzz
from typing import Dict, List, Optional

class EntityResolver:
    def __init__(self, similarity_threshold: int = 85):
        self.similarity_threshold = similarity_threshold
        self.canonical_entities: Dict[str, str] = {}  # alias -> canonical

    def register_canonical(self, canonical_name: str, aliases: Optional[List[str]] = None):
        c_clean = canonical_name.strip()
        self.canonical_entities[c_clean.lower()] = c_clean
        if aliases:
            for alias in aliases:
                self.canonical_entities[alias.strip().lower()] = c_clean

    def resolve_person(self, raw_name: str) -> str:
        clean_name = raw_name.strip()
        lower_name = clean_name.lower()

        # 1. Exact match
        if lower_name in self.canonical_entities:
            return self.canonical_entities[lower_name]

        # 2. Fuzzy match against registered canonicals
        for known_lower, canonical in self.canonical_entities.items():
            if fuzz.token_sort_ratio(lower_name, known_lower) >= self.similarity_threshold:
                self.canonical_entities[lower_name] = canonical
                return canonical

        # 3. If new, register as its own canonical representative
        self.canonical_entities[lower_name] = clean_name
        return clean_name