import { Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Mail, MessageCircle } from 'lucide-react';
import logoImage from '@assets/skybudget-logo.png';

export default function Footer() {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Tagline */}
          <div>
            <div className="flex items-center space-x-2 mb-4" data-testid="footer-logo">
              <img 
                src={logoImage} 
                alt="SkyBudgetFly Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4" data-testid="text-footer-tagline">
              {t('footer.tagline')}
            </p>
            {/* Contact Info */}
            <h3 className="font-semibold mb-4" data-testid="text-footer-contact">
              {t('footer.contactUs')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:info@skybudgetfly.vip" 
                  className="hover:text-white transition-colors"
                  data-testid="link-footer-email"
                >
                  info@skybudgetfly.vip
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span data-testid="text-footer-support">{t('footer.support')}</span>
              </div>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-company">
              {t('footer.company')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors text-left"
                  data-testid="link-footer-about"
                >
                  {t('footer.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('destinations')}
                  className="hover:text-white transition-colors text-left"
                  data-testid="link-footer-destinations"
                >
                  {t('footer.destinations')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="hover:text-white transition-colors text-left"
                  data-testid="link-footer-deals"
                >
                  {t('footer.deals')}
                </button>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4" data-testid="text-footer-legal">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  to="/terms" 
                  className="hover:text-white transition-colors"
                  data-testid="link-footer-terms"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="hover:text-white transition-colors"
                  data-testid="link-footer-privacy"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p data-testid="text-footer-copyright">
            &copy; 2025 SkyBudgetFly. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
