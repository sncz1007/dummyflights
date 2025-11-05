import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import logoImage from '@assets/generated_images/White_on_red_circular_logo_d0fa86e5.png';

export default function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-3 cursor-pointer" data-testid="link-logo">
              <img 
                src={logoImage} 
                alt="SkyBudgetFly Logo" 
                className="h-14 w-auto"
              />
              <span className="text-xl font-display font-bold text-red-600">Flights Dummy</span>
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
