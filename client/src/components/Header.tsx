import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plane, ChevronDown } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="link-logo">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Plane className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">SkyBudgetFly</span>
            </div>
          </Link>
          
          {/* Language Selector */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-language-selector">
                  <span>{language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
                  <span className="hidden sm:inline font-medium">{language.toUpperCase()}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setLanguage('en')} data-testid="button-lang-en">
                  <span className="mr-2">🇺🇸</span>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')} data-testid="button-lang-es">
                  <span className="mr-2">🇪🇸</span>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
