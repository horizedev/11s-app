import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandLogo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/11s-logo.png"
      alt=""
      width={size}
      height={size}
      className={cn("rounded-[11px] shadow-sm", className)}
      priority
    />
  );
}
