import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { Github } from "lucide-react";

export const Footer = () => {
  const t = useTranslations('HomePage.footer');
  const landing = useTranslations('LandingPage');
  
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
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{landing('forSchools')}</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{landing('forCompanies')}</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{landing('pricing')}</Link>
              <a 
                href="https://github.com/fahreziadh/evaly" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
                {t('openSource')}
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              {t('copyright').replace('2023', '2024')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 