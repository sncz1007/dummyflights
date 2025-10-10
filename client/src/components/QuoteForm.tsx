import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AirportSearch from './AirportSearch';
import { sendQuoteEmail } from '@/lib/emailjs';
import { apiRequest } from '@/lib/queryClient';
import { NotebookPen, Lock } from 'lucide-react';

export default function QuoteForm() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quoteSchema = useMemo(() => z.object({
    fullName: z.string().min(2, t('validation.nameRequired')),
    email: z.string().email(t('validation.emailRequired')),
    phone: z.string().optional(),
    country: z.string().optional(),
    fromAirport: z.string().min(3, t('validation.fromAirportRequired')),
    toAirport: z.string().min(3, t('validation.toAirportRequired')),
    departureDate: z.string().min(1, t('validation.departureDateRequired')),
    returnDate: z.string().optional(),
    passengers: z.string().min(1, t('validation.passengersRequired')),
    flightClass: z.string().min(1, t('validation.classRequired')),
    tripType: z.string().default('roundtrip'),
    notes: z.string().optional(),
  }), [t]);

  type QuoteFormData = z.infer<typeof quoteSchema>;

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      fromAirport: '',
      toAirport: '',
      departureDate: '',
      returnDate: '',
      passengers: '1',
      flightClass: 'economy',
      tripType: 'roundtrip',
      notes: '',
    },
  });

  const submitQuote = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      // Generate unique quote number
      const quoteNumber = `SKY${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Prepare quote data for database
      const quoteData = {
        ...data,
        language,
      };

      // Save to database
      const response = await apiRequest('POST', '/api/quotes', quoteData);
      const savedQuote = await response.json();

      // Send email via EmailJS
      await sendQuoteEmail({
        ...data,
        language,
        quoteNumber: savedQuote.quoteNumber,
      });

      return savedQuote;
    },
    onSuccess: () => {
      toast({
        title: t('toast.success'),
        description: t('toast.successMessage'),
        duration: 8000,
      });
      
      form.reset();
      
      // Invalidate quotes cache
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
    },
    onError: (error) => {
      console.error('Quote submission error:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.errorMessage'),
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      await submitQuote.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="py-16 lg:py-24 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4" data-testid="text-quote-title">
            {t('quote.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-quote-subtitle">
            {t('quote.subtitle')}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-contact-section">
                  {t('quote.contact')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-full-name">{t('quote.name')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('quote.namePlaceholder')}
                            {...field}
                            data-testid="input-full-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-email">{t('quote.email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('quote.emailPlaceholder')}
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-phone">{t('quote.phone')}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={t('quote.phonePlaceholder')}
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-country">{t('quote.country')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('quote.countryPlaceholder')}
                            {...field}
                            data-testid="input-country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Flight Details */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="text-flight-section">
                  {t('quote.flightDetails')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromAirport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-from-airport">{t('quote.from')}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t('quote.fromPlaceholder')}
                            data-testid="input-from-airport-quote"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="toAirport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-to-airport">{t('quote.to')}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t('quote.toPlaceholder')}
                            data-testid="input-to-airport-quote"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-departure-date">{t('quote.departure')}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-departure-date-quote"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-return-date">{t('quote.return')}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-return-date-quote"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="passengers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-passengers-quote">{t('quote.passengers')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-passengers-quote">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">{t('passengers.1')}</SelectItem>
                            <SelectItem value="2">{t('passengers.2')}</SelectItem>
                            <SelectItem value="3">{t('passengers.3')}</SelectItem>
                            <SelectItem value="4">{t('passengers.4')}</SelectItem>
                            <SelectItem value="5+">{t('passengers.5+')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="flightClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-class-quote">{t('quote.class')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-class-quote">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economy">{t('search.economy')}</SelectItem>
                            <SelectItem value="premium">{t('search.premium')}</SelectItem>
                            <SelectItem value="business">{t('search.business')}</SelectItem>
                            <SelectItem value="first">{t('search.first')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-notes">{t('quote.notes')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('quote.notesPlaceholder')}
                        rows={4}
                        {...field}
                        data-testid="textarea-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || submitQuote.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                data-testid="button-submit-quote"
              >
                {isSubmitting || submitQuote.isPending ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <NotebookPen className="h-5 w-5" />
                    <span>{t('quote.submit')}</span>
                  </>
                )}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground flex items-center justify-center space-x-2" data-testid="text-privacy-notice">
                <Lock className="h-4 w-4" />
                <span>{t('quote.privacy')}</span>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
