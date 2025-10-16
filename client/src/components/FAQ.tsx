import { useTranslation } from '@/hooks/useTranslation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = [
    { id: 'q1', question: t('faq.q1.question'), answer: t('faq.q1.answer') },
    { id: 'q2', question: t('faq.q2.question'), answer: t('faq.q2.answer') },
    { id: 'q3', question: t('faq.q3.question'), answer: t('faq.q3.answer') },
    { id: 'q4', question: t('faq.q4.question'), answer: t('faq.q4.answer') },
    { id: 'q5', question: t('faq.q5.question'), answer: t('faq.q5.answer') },
    { id: 'q6', question: t('faq.q6.question'), answer: t('faq.q6.answer') },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3" data-testid="text-faq-title">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-card border rounded-lg px-6 py-2"
              data-testid={`accordion-item-${faq.id}`}
            >
              <AccordionTrigger 
                className="text-left hover:no-underline"
                data-testid={`accordion-trigger-${faq.id}`}
              >
                <span className="font-semibold text-base pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent 
                className="text-muted-foreground pt-2 pb-4"
                data-testid={`accordion-content-${faq.id}`}
              >
                {faq.answer.includes('||') ? (
                  <div className="space-y-3">
                    {faq.answer.split('||').map((paragraph, index) => (
                      <p key={index} className="text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  faq.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
