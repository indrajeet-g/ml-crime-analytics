import networkx as nx
from typing import Dict, List, Any

class CrimeGraphEngine:
    def __init__(self):
        self.graph = nx.Graph()

    def add_entity_node(self, node_id: str, node_type: str, attributes: Dict[str, Any] = None):
        attr = attributes or {}
        attr["entity_type"] = node_type
        if node_id not in self.graph:
            self.graph.add_node(node_id, **attr)
        else:
            self.graph.nodes[node_id].update(attr)

    def add_relationship(self, source: str, target: str, rel_type: str, weight: float = 1.0, timestamp: str = None):
        if self.graph.has_edge(source, target):
            self.graph[source][target]["weight"] += weight
            self.graph[source][target]["interactions"] += 1
            if timestamp:
                self.graph[source][target].setdefault("timestamps", []).append(timestamp)
        else:
            self.graph.add_edge(
                source,
                target,
                relation=rel_type,
                weight=weight,
                interactions=1,
                timestamps=[timestamp] if timestamp else []
            )

    def compute_investigative_metrics(self) -> List[Dict[str, Any]]:
        """Calculates degree, betweenness, and PageRank to spot key players and stealth bridges."""
        if len(self.graph) == 0:
            return []

        betweenness = nx.betweenness_centrality(self.graph, weight="weight")
        pagerank = nx.pagerank(self.graph, weight="weight")
        degree = dict(self.graph.degree())

        rankings = []
        for node in self.graph.nodes():
            rankings.append({
                "entity": node,
                "type": self.graph.nodes[node].get("entity_type", "UNKNOWN"),
                "betweenness": round(betweenness[node], 4),
                "pagerank": round(pagerank[node], 4),
                "degree": degree[node],
                # A bridge connects separate sub-networks despite having low direct degree
                "is_stealth_broker": betweenness[node] > 0.25 and degree[node] <= 3
            })

        return sorted(rankings, key=lambda x: x["betweenness"], reverse=True)

    def to_dict(self) -> Dict[str, Any]:
        """Export serialized graph for UI adapters."""
        return nx.node_link_data(self.graph)