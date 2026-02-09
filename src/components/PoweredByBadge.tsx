import { ExternalLink } from "lucide-react";

export function PoweredByBadge() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-4 text-xs text-muted-foreground">
      <span>Powered by</span>
      <a
        href="https://sankofabloom.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline"
      >
        Sankofa Bloom
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </a>
    </div>
  );
}
