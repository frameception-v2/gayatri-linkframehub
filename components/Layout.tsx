"use client";

import { cn } from "~/lib/utils";
import { type Context } from "@farcaster/frame-sdk";
import { useState } from "react";
import { useSwipe } from "~/hooks/useSwipe";
import { useOrientation } from "~/hooks/useOrientation";

export function Layout({
  children,
  context,
  className,
}: {
  children: React.ReactNode;
  context?: Context.FrameContext;
  className?: string;
}) {
  const { orientation } = useOrientation();
  const [activePanel, setActivePanel] = useState(0);
  const panelCount = React.Children.count(children);

  const handleSwipe = (direction: string) => {
    if (direction === 'left' && activePanel < panelCount - 1) {
      setActivePanel(prev => prev + 1);
    } else if (direction === 'right' && activePanel > 0) {
      setActivePanel(prev => prev - 1);
    }
  };

  useSwipe(handleSwipe, { threshold: 50, velocity: 0.1 });
  return (
    <div
      className={cn(
        `grid ${orientation === 'portrait' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`,
        "min-h-[100dvh] h-full w-full",
        "p-4",
        "text-base leading-normal font-sans",
        "overflow-hidden",
        className
      )}
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div
        className="flex transition-transform duration-300 ease-out md:transform-none"
        style={{
          transform: `translateX(-${activePanel * 100}%)`,
          width: `${panelCount * 100}%`
        }}
      >
        {React.Children.map(children, (child) => (
          <div className="w-full md:w-auto md:flex-1">{child}</div>
        ))}
      </div>
    </div>
  );
}
