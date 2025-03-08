"use client";

import { type FrameContext } from "@farcaster/frame-sdk";
import { ReactNode } from "react";

export default function Layout({
  children,
  context,
}: {
  children: ReactNode;
  context?: FrameContext;
}) {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
      style={{
        minHeight: "100dvh",
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
    >
      {children}
    </div>
  );
}
