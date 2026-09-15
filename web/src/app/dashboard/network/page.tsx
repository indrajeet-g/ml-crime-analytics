"use client";

import GraphExplorer from "@/components/GraphExplorer";

/* No fixed height on the wrapper. GraphExplorer is taller than the viewport,
   so pinning it to calc(100vh-4rem) with overflow-hidden clipped everything
   below the fold with no way to reach it. Let the content flow and let the
   layout's scrolling main element handle it. */
export default function NetworkPage() {
  return (
    <div className="w-full pb-10 pt-4">
      <GraphExplorer />
    </div>
  );
}
