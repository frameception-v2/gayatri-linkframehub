"use client";

import { useEffect, useCallback, useState, useRef, useReducer } from "react";
import { useShakeDetector } from "~/lib/sensors";
import { useOrientation } from "~/hooks/useOrientation";
import type { AddFrameResult } from "@farcaster/frame-sdk";
import { useLongPress } from "~/hooks/useLongPress";
import { usePressState } from "~/hooks/usePressState";
import { clsx } from "clsx";
import type { FrameContext } from "@farcaster/frame-sdk";
import sdk, {
  AddFrame,
  SignIn as SignInCore
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";
import "~/styles/ripple.css";
import Layout from "~/components/Layout";
import { Avatar } from "~/components/Avatar";
import { getRecentLinks, saveLink } from "~/lib/storage";
import { PurpleButton } from "~/components/ui/PurpleButton";

import { RecentLinks } from "./RecentLinks";
import { ContextMenu } from "~/components/ContextMenu";

function SocialLinks({
  setSelectedUrl,
  setMenuPosition,
  pressStateProps
}: {
  setSelectedUrl: (url: string | null) => void;
  setMenuPosition: (pos: { x: number; y: number }) => void;
  pressStateProps: ReturnType<typeof usePressState>[1];
}) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto">
      {/* Permanent links */}
      <a
        href="https://warpcast.com/~/channel/frame"
        target="_blank"
        rel="noopener noreferrer"
        className="group ripple-container relative overflow-hidden"
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedUrl(e.currentTarget.href);
          setMenuPosition({ x: e.clientX, y: e.clientY });
        }}
        {...useLongPress({
          onLongPress: (e: React.TouchEvent | React.MouseEvent) => {
            const target = e.currentTarget as HTMLAnchorElement;
            const rect = target.getBoundingClientRect();
            setSelectedUrl(target.href);
            setMenuPosition({
              x: rect.left + rect.width/2,
              y: rect.top + rect.height/2
            });
          },
          onCancel: () => setSelectedUrl(null),
          delay: 500
        })}
      >
        <PurpleButton 
          className="w-full min-h-[48px] px-4 hover:bg-purple-600 transition-colors relative"
          {...pressStateProps}
        >
          🌿 Farcaster Channel
        </PurpleButton>
      </a>
      
      <a
        href="https://github.com/farcasterxyz/hub-monorepo"
        target="_blank"
        rel="noopener noreferrer"
        className="group ripple-container relative overflow-hidden"
        {...useLongPress({
          onLongPress: (e: React.TouchEvent | React.MouseEvent) => {
            const target = e.currentTarget as HTMLAnchorElement;
            const rect = target.getBoundingClientRect();
            setSelectedUrl(target.href);
            setMenuPosition({
              x: rect.left + rect.width/2,
              y: rect.top + rect.height/2
            });
          },
          onCancel: () => setSelectedUrl(null),
          delay: 500
        })}
        onContextMenu={(e) => {
          e.preventDefault();
          setSelectedUrl(e.currentTarget.href);
          setMenuPosition({ x: e.clientX, y: e.clientY });
        }}
        {...useLongPress({
          onLongPress: (e: React.TouchEvent | React.MouseEvent) => {
            const target = e.currentTarget as HTMLAnchorElement;
            const rect = target.getBoundingClientRect();
            setSelectedUrl(target.href);
            setMenuPosition({
              x: rect.left + rect.width/2,
              y: rect.top + rect.height/2
            });
          },
          onCancel: () => setSelectedUrl(null),
          delay: 500
        })}
      >
        <PurpleButton 
          className="w-full min-h-[48px] px-4 hover:bg-purple-600 transition-colors relative"
          {...pressStateProps}
        >
          🐙 GitHub Repository
        </PurpleButton>
      </a>
    </div>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<sdk.FrameContext>();
  const containerRef = useRef<HTMLDivElement>(null);
  const orientation = useOrientation() || { isPortrait: true }; // Fallback for SSR
  const initialHeight = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    initialHeight.current = window.visualViewport?.height || 0;
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const viewport = window.visualViewport;
      if (!viewport) return;

      // Check if keyboard is open (viewport height reduced by more than 100px)
      if (initialHeight.current - viewport.height > 100) {
        containerRef.current.style.paddingBottom = `${initialHeight.current - viewport.height}px`;
      } else {
        containerRef.current.style.paddingBottom = '0';
      }
    };

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleResize);
      return () => viewport.removeEventListener('resize', handleResize);
    }
  }, []);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [pressState, pressStateProps] = usePressState();
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  useShakeDetector(() => {
    // Force refresh of recent links
    getRecentLinks(); // This will update localStorage cache
    forceUpdate();
  });

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    setAddFrameResult(""); // Reset result state
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready();

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Layout 
      context={context}
      className={orientation.isPortrait ? 'grid-cols-1' : 'grid-cols-2 gap-4'}
    >
      <div className="keyboard-avoidance-container">
        <Avatar 
          src={context?.user?.avatar} 
          alt={context?.user?.username}
          className="mx-auto mb-4"
        />
        <SocialLinks 
          setSelectedUrl={setSelectedUrl}
          setMenuPosition={setMenuPosition}
          pressStateProps={pressStateProps}
        />
        <RecentLinks recentLinks={getRecentLinks()} />
      </div>
      {selectedUrl && (
        <ContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          url={selectedUrl}
          onClose={() => setSelectedUrl(null)}
        />
      )}
    </Layout>
  );
}
