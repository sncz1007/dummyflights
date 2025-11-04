import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Download, FileText, Receipt, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const id = sessionStorage.getItem('bookingId');
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    setBookingId(id);
    setLanguage(lang);

    if (!id) {
      // If no booking ID, redirect to home
      setLocation('/');
    }
  }, [setLocation]);

  const handleGoHome = () => {
    sessionStorage.removeItem('selectedFlight');
    sessionStorage.removeItem('searchParams');
    sessionStorage.removeItem('bookingId');
    setLocation('/');
  };

  if (!bookingId) {
    return null;
  }

  const isSpanish = language === 'es';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 md:p-12 shadow-2xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {isSpanish ? '¡Gracias por tu compra!' : 'Thank you for your purchase!'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {isSpanish 
                ? 'Tu pago se ha procesado exitosamente' 
                : 'Your payment has been processed successfully'}
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {isSpanish ? 'Número de reserva:' : 'Booking reference:'}
            </p>
            <p className="text-xl font-mono font-bold text-center text-blue-600 dark:text-blue-400">
              {bookingId.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Download PDFs Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {isSpanish ? 'Descarga tus documentos' : 'Download your documents'}
            </h2>
            
            <div className="space-y-4">
              {/* Booking Confirmation PDF */}
              <a
                href={`/api/bookings/${bookingId}/confirmation-pdf`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full h-auto py-6 bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <div className="flex items-center justify-center gap-3 w-full">
                    <FileText className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-base">
                        {isSpanish ? 'Confirmación de Vuelo' : 'Booking Confirmation'}
                      </p>
                      <p className="text-xs text-blue-100">
                        {isSpanish 
                          ? 'Detalles completos del itinerario' 
                          : 'Complete flight itinerary details'}
                      </p>
                    </div>
                    <Download className="w-5 h-5" />
                  </div>
                </Button>
              </a>

              {/* Payment Receipt PDF */}
              <a
                href={`/api/bookings/${bookingId}/receipt-pdf?paymentMethod=Card`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full h-auto py-6 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <div className="flex items-center justify-center gap-3 w-full">
                    <Receipt className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-base">
                        {isSpanish ? 'Recibo de Pago' : 'Payment Receipt'}
                      </p>
                      <p className="text-xs text-green-100">
                        {isSpanish 
                          ? 'Comprobante del servicio de reserva' 
                          : 'Service fee payment receipt'}
                      </p>
                    </div>
                    <Download className="w-5 h-5" />
                  </div>
                </Button>
              </a>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-5 mb-8">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
              {isSpanish ? '📧 Próximos pasos:' : '📧 Next steps:'}
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                <span>
                  {isSpanish 
                    ? 'Hemos enviado una confirmación a tu correo electrónico' 
                    : 'We have sent a confirmation to your email'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                <span>
                  {isSpanish 
                    ? 'Compraremos tus boletos de avión en las próximas 24-48 horas' 
                    : 'We will purchase your flight tickets within 24-48 hours'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                <span>
                  {isSpanish 
                    ? 'Te enviaremos los tickets por correo una vez comprados' 
                    : 'Tickets will be emailed to you once purchased'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">📥</span>
                <span>
                  {isSpanish 
                    ? 'Guarda los PDFs de arriba para tus registros' 
                    : 'Please save the PDFs above for your records'}
                </span>
              </li>
            </ul>
          </div>

          {/* Back to Home Button */}
          <div className="text-center">
            <Button
              onClick={handleGoHome}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <Home className="w-4 h-4 mr-2" />
              {isSpanish ? 'Volver al Inicio' : 'Back to Home'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
