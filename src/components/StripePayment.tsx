import React, { useState } from 'react';
import { getApiUrl } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface StripePaymentProps {
  amount?: number;
  productName?: string;
  buttonText?: string;
  className?: string;
  initialEmail?: string;
  onEmailChange?: (email: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount = 4900, // $49.00 in cents
  productName = 'Tennis Analysis Pro',
  buttonText = 'Comprar Tennis Analysis Pro - $49',
  className = '',
  initialEmail = '',
  onEmailChange
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailValidation, setShowEmailValidation] = useState(false);

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
    setShowEmailValidation(value.length > 0);
    
    // Call parent's onEmailChange if provided
    if (onEmailChange) {
      onEmailChange(value);
    }
  };

  const handlePayment = async () => {
    // Validate email
    if (!email || !validateEmail(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/api/payments/create-payment'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          amount: amount,
          product_name: productName
        })
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        setError(data.error || 'Error al procesar el pago');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Error de conexión. Intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  return (
    <div className={`payment-section space-y-4 ${className}`}>
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-800">
          Email Address
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="tu@email.com"
          className={`${
            showEmailValidation && email && !validateEmail(email) 
              ? 'border-red-300 focus:ring-red-500 text-red-900' 
              : showEmailValidation && email && validateEmail(email)
              ? 'border-green-300 focus:ring-green-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isProcessing}
        />
        {showEmailValidation && email && !validateEmail(email) && (
          <div className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>Email debe contener @ y . (ejemplo: nombre@dominio.com)</span>
          </div>
        )}
        {showEmailValidation && email && validateEmail(email) && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span>Formato de email válido</span>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handlePayment}
        disabled={!email || !validateEmail(email) || isProcessing}
        size="lg"
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? 'Procesando...' : buttonText}
      </Button>
    </div>
  );
};

export default StripePayment;