"use client";

import GraphExplorer from "@/components/GraphExplorer";

export default function NetworkPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden pb-10 pt-4">
      <GraphExplorer />
    </div>
  );
}
