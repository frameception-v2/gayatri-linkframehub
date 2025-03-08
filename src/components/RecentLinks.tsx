import { cn } from "~/lib/utils";
import { formatTimeAgo } from "~/lib/utils";

export interface RecentLink {
  url: string;
  timestamp: number;
  title?: string;
}

export function RecentLinks({ recentLinks }: { recentLinks: RecentLink[] }) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto max-h-[300px] overflow-y-auto">
      <h3 className="text-lg font-semibold">Recent Links</h3>
      {recentLinks.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden"
        >
          <div className={cn(
            "w-full min-h-[48px] px-4 py-2",
            "bg-purple-100 hover:bg-purple-200 transition-colors",
            "rounded-lg border border-purple-300",
            "flex flex-col"
          )}>
            <span className="font-medium truncate">{link.title || link.url}</span>
            <time className="text-xs text-purple-600">{formatTimeAgo(link.timestamp)}</time>
          </div>
        </a>
      ))}
    </div>
  );
}
