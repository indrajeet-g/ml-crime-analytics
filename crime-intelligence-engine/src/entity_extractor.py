import re
import spacy
from typing import Dict, List, Any

class CrimeEntityExtractor:
    def __init__(self, model_name: str = "en_core_web_sm"):
        try:
            self.nlp = spacy.load(model_name)
        except OSError:
            # Fallback for CI/local environments before spacy download
            from spacy.cli import download
            download(model_name)
            self.nlp = spacy.load(model_name)

        # RegEx tailored for Indian law enforcement records
        self.phone_pattern = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
        self.vehicle_pattern = re.compile(r'\b[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,3}[-\s]?\d{4}\b')
        self.bank_acc_pattern = re.compile(r'\b(?:AC|A/C|ACC)?[-:\s]?(\d{9,18})\b', re.IGNORECASE)

    @staticmethod
    def clean_phone(phone: str) -> str:
        digits = "".join(filter(str.isdigit, phone))
        return digits[-10:] if len(digits) >= 10 else digits

    def extract_from_text(self, text: str) -> Dict[str, List[str]]:
        doc = self.nlp(text)
        
        persons = list({ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"})
        orgs = list({ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"})
        locations = list({ent.text.strip() for ent in doc.ents if ent.label_ in ["GPE", "LOC"]})

        raw_phones = self.phone_pattern.findall(text)
        phones = list({self.clean_phone(p) for p in raw_phones})
        
        vehicles = list({v.replace(" ", "").upper() for v in self.vehicle_pattern.findall(text)})
        bank_accounts = list({b for b in self.bank_acc_pattern.findall(text) if len(b) >= 9})

        return {
            "persons": persons,
            "organizations": orgs,
            "locations": locations,
            "phones": phones,
            "vehicles": vehicles,
            "bank_accounts": bank_accounts
        }