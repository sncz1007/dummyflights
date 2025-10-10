import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';

export default function ContactSection() {
  const { t } = useTranslation();

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startChat = () => {
    // Trigger Brevo chat widget if available
    if (window.BrevoConversations) {
      window.BrevoConversations('showChat');
    } else {
      // Fallback to email if chat is not available
      window.location.href = 'mailto:skybudgetfly@gmail.com';
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-br from-secondary to-accent text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6" data-testid="text-contact-title">
          {t('contact.title')}
        </h2>
        <p className="text-lg sm:text-xl mb-8 opacity-90" data-testid="text-contact-subtitle">
          {t('contact.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <a 
            href="mailto:skybudgetfly@gmail.com" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            data-testid="link-contact-email"
          >
            <Mail className="h-6 w-6" />
            <span className="text-lg">skybudgetfly@gmail.com</span>
          </a>
          <a 
            href="tel:+15551234567" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            data-testid="link-contact-phone"
          >
            <Phone className="h-6 w-6" />
            <span className="text-lg">+1 (555) 123-4567</span>
          </a>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={scrollToQuote}
            className="bg-white text-secondary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="button-contact-quote"
          >
            {t('contact.quote')}
          </Button>
          <Button 
            onClick={startChat}
            variant="outline"
            className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            data-testid="button-contact-chat"
          >
            {t('contact.chat')}
          </Button>
        </div>
      </div>
    </section>
  );
}
