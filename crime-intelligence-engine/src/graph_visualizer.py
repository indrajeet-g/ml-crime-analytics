import os
from pyvis.network import Network
import networkx as nx

# Color palette mapped by entity type
COLOR_MAP = {
    "Person": "#2b5c8f",        # Steel Blue
    "Phone": "#e67e22",         # Orange
    "Organization": "#8e44ad",  # Purple
    "Vehicle": "#16a085",       # Teal
    "Bank_Account": "#27ae60",  # Green
    "KEY_BROKER": "#c0392b"     # Crimson Red
}

def export_interactive_report(graph_engine, output_path: str = "crime_network_report.html"):
    net = Network(height="750px", width="100%", bgcolor="#1a1a1a", font_color="#ffffff", directed=False)
    
    # Compute centrality metrics to drive visual weight
    metrics = {m["entity"]: m for m in graph_engine.compute_investigative_metrics()}
    
    # Add Nodes
    for node_id in graph_engine.graph.nodes():
        node_attr = graph_engine.graph.nodes[node_id]
        raw_type = node_attr.get("entity_type", "UNKNOWN")
        metric_data = metrics.get(node_id, {})
        
        betweenness = metric_data.get("betweenness", 0.0)
        is_broker = metric_data.get("is_stealth_broker", False)

        # Broker overrides standard entity color
        if is_broker:
            color = COLOR_MAP["KEY_BROKER"]
            label_prefix = "🚨 "
        else:
            color = COLOR_MAP.get(raw_type, "#95a5a6")
            label_prefix = ""

        # Node size scales with betweenness centrality (Base: 15, Max: 45)
        size = 15 + int(betweenness * 35)

        # Hover tooltip (shows provenance and investigative metrics)
        tooltip = (
            f"<b>{node_id}</b><br>"
            f"Type: {raw_type}<br>"
            f"Betweenness Centrality: {betweenness}<br>"
            f"Degree: {metric_data.get('degree', 0)}<br>"
            f"{'<b>Status: CRITICAL STEALTH BROKER</b>' if is_broker else ''}"
        )

        net.add_node(
            node_id,
            label=f"{label_prefix}{node_id}",
            title=tooltip,
            color=color,
            size=size,
            shape="dot" if raw_type != "Organization" else "square"
        )

    # Add Edges
    for u, v, data in graph_engine.graph.edges(data=True):
        rel_type = data.get("relation", "LINKED")
        weight = data.get("weight", 1.0)
        
        # Line width scales with interaction weight
        width = 1.0 + min(weight / 3.0, 5.0)

        net.add_edge(
            u,
            v,
            title=f"Relation: {rel_type} (Weight: {weight})",
            label=rel_type if weight > 1 else "",
            value=width,
            color="#7f8c8d"
        )

    # Physics configuration for clean force-directed cluster separation
    net.barnes_hut(gravity=-3000, central_gravity=0.3, spring_length=120, spring_strength=0.05)
    
    net.save_graph(output_path)
    print(f"\n[+] Interactive Report Generated: {os.path.abspath(output_path)}")