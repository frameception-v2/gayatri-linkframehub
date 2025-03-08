"use client";

import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { PurpleButton } from "./ui/PurpleButton";

interface ContextMenuProps {
  x: number;
  y: number;
  url: string;
  onClose: () => void;
  className?: string;
}

export function ContextMenu({ x, y, url, onClose, className }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onClose();
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Shared from Farcaster Frame",
        url: url
      });
      onClose();
    } catch (err) {
      console.error("Failed to share:", err);
    }
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute z-50 min-w-[160px] rounded-lg bg-white p-1 shadow-lg",
        "dark:bg-gray-800 dark:shadow-gray-950/50",
        className
      )}
      style={{ 
        left: `${x}px`,
        top: `${y}px`,
        transform: "translateY(10px)"
      }}
    >
      <div className="space-y-1">
        <PurpleButton
          onClick={handleCopy}
          className="w-full justify-start text-sm"
          variant="ghost"
        >
          Copy URL
        </PurpleButton>
        <PurpleButton
          onClick={handleShare}
          className="w-full justify-start text-sm"
          variant="ghost"
        >
          Share...
        </PurpleButton>
      </div>
      <div className="absolute -top-2 left-3 -ml-1 h-4 w-4 rotate-45 bg-white dark:bg-gray-800" />
    </div>
  );
}
