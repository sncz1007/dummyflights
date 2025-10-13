import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Plane, Menu, ChevronDown, Shield } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationItems = [
    { key: 'nav.home', href: '#home', onClick: () => scrollToSection('home') },
    { key: 'nav.destinations', href: '#destinations', onClick: () => scrollToSection('destinations') },
    { key: 'nav.deals', href: '#deals', onClick: () => scrollToSection('deals') },
    { key: 'nav.quote', href: '#quote', onClick: () => scrollToSection('quote') },
    { key: 'nav.contact', href: '#contact', onClick: () => scrollToSection('contact') },
  ] as const;

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className="text-foreground hover:text-primary transition-colors font-medium"
                data-testid={`button-nav-${item.key.split('.')[1]}`}
              >
                {t(item.key)}
              </button>
            ))}
            {user?.role === 'admin' && location !== '/admin' && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-admin-link">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
          
          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
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
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className="text-left text-foreground hover:text-primary transition-colors font-medium py-2"
                      data-testid={`button-mobile-nav-${item.key.split('.')[1]}`}
                    >
                      {t(item.key)}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
