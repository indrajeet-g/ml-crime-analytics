import hashlib
import json
import time
from typing import Dict, Any, List

class CustodyBlock:
    def __init__(self, index: int, timestamp: float, action: str, officer_id: str, payload_hash: str, prev_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.action = action
        self.officer_id = officer_id
        self.payload_hash = payload_hash
        self.prev_hash = prev_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = f"{self.index}|{self.timestamp}|{self.action}|{self.officer_id}|{self.payload_hash}|{self.prev_hash}"
        return hashlib.sha256(block_string.encode("utf-8")).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "action": self.action,
            "officer_id": self.officer_id,
            "payload_hash": self.payload_hash,
            "prev_hash": self.prev_hash,
            "hash": self.hash
        }

class ChainOfCustodyLedger:
    def __init__(self):
        self.chain: List[CustodyBlock] = [self._create_genesis_block()]

    def _create_genesis_block(self) -> CustodyBlock:
        return CustodyBlock(0, 1700000000.0, "GENESIS_INIT", "SYSTEM_NCRB", "0" * 64, "0" * 64)

    def record_event(self, action: str, officer_id: str, raw_data: str) -> CustodyBlock:
        payload_hash = hashlib.sha256(raw_data.encode("utf-8")).hexdigest()
        prev_block = self.chain[-1]
        
        new_block = CustodyBlock(
            index=len(self.chain),
            timestamp=time.time(),
            action=action,
            officer_id=officer_id,
            payload_hash=payload_hash,
            prev_hash=prev_block.hash
        )
        self.chain.append(new_block)
        return new_block

    def verify_integrity(self) -> bool:
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]

            if curr.prev_hash != prev.hash:
                return False
            if curr.hash != curr.calculate_hash():
                return False
        return True