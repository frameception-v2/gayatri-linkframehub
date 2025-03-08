import { cn } from "~/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt = "", size = 48, className }: AvatarProps) {
  return (
    <div 
      className={cn(
        "rounded-full border-2 border-white overflow-hidden",
        "font-system text-base leading-none", // System font stack
        className
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          width={size}
          height={size}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">?</span>
        </div>
      )}
    </div>
  );
}
