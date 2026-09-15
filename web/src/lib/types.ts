export type EntityType =
  | "PERSON" | "PHONE" | "VEHICLE" | "ACCOUNT"
  | "LOCATION" | "CASE" | "EVENT" | "ORGANIZATION";

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType | string;
  community: string | null;
  betweenness: number;
  pagerank: number;
  degree: number;
  isBroker: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  rel: string;
  conf: number;
  rec: string;
}

export interface AliasCluster {
  name: string;
  records: { id: string; city: string; occupation: string; community: string; age: string }[];
}

export interface NetworkData {
  stats: Record<string, number>;
  relTypes: [string, number][];
  crimeTypes: [string, number][];
  cities: [string, number][];
  topEntities: GraphNode[];
  brokers: GraphNode[];
  aliasClusters: AliasCluster[];
  graph: { nodes: GraphNode[]; links: GraphLink[] };
}
