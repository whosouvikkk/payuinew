import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';

// --- SHARED COMPONENT ---
type PlanData = {
  id: string;
  title: string;
  subtitle: string;
  priceHeading: string;
  steps: string[];
  footerNote: string;
};

function PaymentView({ data }: { data: PlanData }) {
  const [transactionId, setTransactionId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);

    // Validation: Ensure transaction ID is more than 5 characters
    if (transactionId.trim().length <= 5) {
      setResult({
        type: 'error',
        text: 'Transaction ID / UTR must be more than 5 digits.'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: data.id,
          transactionId: transactionId.trim(),
          username: username.trim()
        })
      });
      
      if (!res.ok) throw new Error('Failed');
      
      setResult({
        type: 'success',
        text: 'Payment details submitted! After verifying, your plan/credits will be added.'
      });
      
      // Clear form on success
      setTransactionId('');
      setUsername('');
    } catch (err) {
      setResult({
        type: 'error',
        text: 'Failed to submit payment details. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a10]">
      {/* Main Payment Card with Pinkish Theme */}
      <div className="bg-[#12101a] border border-pink-900/30 rounded-xl p-6 md:p-8 w-full max-w-lg shadow-[0_0_40px_rgba(236,72,153,0.05)]">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{data.title}</h1>
          <p className="text-gray-400 text-sm">{data.subtitle}</p>
        </div>

        {/* QR Code Segment */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/scanner.png" 
            alt="QR Code" 
            className="w-48 h-48 object-contain rounded-lg bg-black border border-pink-900/50 p-2"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Nhbm5lcjwvdGV4dD48L3N2Zz4=';
            }}
          />
        </div>

        {/* Instructions Section */}
        <div className="mb-8 bg-[#0a0910] border border-gray-800 rounded-lg p-4">
          <p className="text-pink-500 font-bold text-lg mb-3 text-center">{data.priceHeading}</p>
          <ul className="text-gray-300 text-sm space-y-2 mb-4">
            {data.steps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-pink-600 font-bold">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-400 text-xs italic text-center">{data.footerNote}</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-xs font-bold mb-2">Transaction ID</label>
            <input
              type="text"
              required
              minLength={6}
              placeholder="Enter your UPI Txn ID / UTR"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-[#0a0910] border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-white text-xs font-bold mb-2">MoonWitch Username</label>
            <input
              type="text"
              required
              placeholder="e.g. kaddulele"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0910] border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]"
          >
            {loading ? 'Submitting...' : 'Payment Done'}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </form>

        {/* Result Message */}
        {result && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium border ${result.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-900/50' : 'bg-red-900/20 text-red-400 border-red-900/50'}`}>
            {result.text}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ROUTER ---
export default function App() {
  const baseData = { title: 'INR Payment', subtitle: 'Complete your transaction using the QR code below.' };

  const creditsPlan = {
    ...baseData,
    id: 'credits',
    priceHeading: 'Minimum Purchase: ₹50 (20 Credits)',
    steps: [
      'Scan the QR code above using any UPI app.',
      'Pay a minimum of ₹50 to receive 20 Credits.',
      'You may purchase additional credits by paying a higher amount.',
      'Enter your MoonWitch Username.',
      'Enter your UTR / Transaction Number.',
      'Click "Payment Done".',
      'Once your payment is manually verified, your credits will be added to your account.'
    ],
    footerNote: 'Note: Credits never expire and can be used anytime.'
  };

  const weeklyPlan = {
    ...baseData,
    id: 'weekly',
    priceHeading: 'Price: ₹149',
    steps: [
      'Scan the QR code above using any UPI app.',
      'Pay exactly ₹149.',
      'Enter your MoonWitch Username.',
      'Enter your UTR / Transaction Number.',
      'Click "Payment Done".',
      'After manual verification, your Weekly Subscription will be activated.'
    ],
    footerNote: 'Verification usually takes only a short time.'
  };

  const monthlyPlan = {
    ...baseData,
    id: 'monthly',
    priceHeading: 'Price: ₹499',
    steps: [
      'Scan the QR code above using any UPI app.',
      'Pay exactly ₹499.',
      'Enter your MoonWitch Username.',
      'Enter your UTR / Transaction Number.',
      'Click "Payment Done".',
      'After manual verification, your Monthly Subscription will be activated.'
    ],
    footerNote: 'Enjoy uninterrupted premium access for 30 days after activation.'
  };

  const lifetimePlan = {
    ...baseData,
    id: 'lifetime',
    priceHeading: 'Price: ₹1,999',
    steps: [
      'Scan the QR code above using any UPI app.',
      'Pay exactly ₹1,999.',
      'Enter your MoonWitch Username.',
      'Enter your UTR / Transaction Number.',
      'Click "Payment Done".',
      'After manual verification, Lifetime Access will be permanently added to your account.'
    ],
    footerNote: 'One-time payment. No renewals or recurring charges.'
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/credits" replace />} />
      <Route path="/credits" element={<PaymentView data={creditsPlan} />} />
      <Route path="/weekly" element={<PaymentView data={weeklyPlan} />} />
      <Route path="/monthly" element={<PaymentView data={monthlyPlan} />} />
      <Route path="/lifetime" element={<PaymentView data={lifetimePlan} />} />
    </Routes>
  );
}
