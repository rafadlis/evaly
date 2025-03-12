import { Link } from "@/i18n/navigation";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-6 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-semibold text-xs">E</span>
            </div>
            <span className="font-semibold">Evaly</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">For Schools</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">For Companies</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Security</Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Evaly. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 