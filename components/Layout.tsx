"use client";

import { cn } from "~/lib/utils";
import { type Context } from "@farcaster/frame-sdk";

export default function Layout({
  children,
  context,
  className,
}: {
  children: React.ReactNode;
  context?: Context.FrameContext;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        "min-h-[100dvh] h-full w-full",
        "p-4",
        "text-base leading-normal font-sans",
        className
      )}
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {children}
    </div>
  );
}
