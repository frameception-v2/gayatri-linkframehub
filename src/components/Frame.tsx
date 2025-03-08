"use client";

import { useEffect, useCallback, useState } from "react";
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
import Layout from "~/components/Layout";
import { Avatar } from "~/components/Avatar";
import { getRecentLinks, saveLink } from "~/lib/storage";
import { PurpleButton } from "~/components/ui/PurpleButton";

import { RecentLinks } from "./RecentLinks";
import { ContextMenu } from "~/components/ContextMenu";

function SocialLinks({
  setSelectedUrl,
  setMenuPosition
}: {
  setSelectedUrl: (url: string | null) => void;
  setMenuPosition: (pos: { x: number; y: number }) => void;
}) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto">
      {/* Permanent links */}
      <a
        href="https://warpcast.com/~/channel/frame"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden"
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
          className="w-full min-h-[48px] px-4 hover:bg-purple-600 transition-colors"
          size={48}
        >
          🌿 Farcaster Channel
        </PurpleButton>
      </a>
      
      <a
        href="https://github.com/farcasterxyz/hub-monorepo"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden"
      >
        <PurpleButton 
          className="w-full min-h-[48px] px-4 hover:bg-purple-600 transition-colors"
          size={48}
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
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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
    <Layout context={context}>
      <Avatar 
        src={context?.user?.avatar} 
        alt={context?.user?.username}
        className="mx-auto mb-4"
      />
      <SocialLinks />
      <RecentLinks recentLinks={getRecentLinks()} />
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
