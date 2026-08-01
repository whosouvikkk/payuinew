import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';

// --- SHARED COMPONENT ---
// Reused across all 4 pages, driven entirely by the `data` prop.
function PaymentView({ data }: { data: { id: string; title: string; price: string; desc: string } }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Using relative path so Vercel rewrites handle it automatically
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: data.id, amount: data.price })
      });
      
      const json = await res.json();
      setResult(json.message || 'Payment processed successfully!');
    } catch (err) {
      setResult('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Navigation Links for testing purposes */}
      <nav className="mb-12 flex gap-4 text-sm font-medium text-pink-300">
        <Link to="/credits" className="hover:text-pink-500 transition-colors">Credits</Link>
        <Link to="/weekly" className="hover:text-pink-500 transition-colors">Weekly</Link>
        <Link to="/monthly" className="hover:text-pink-500 transition-colors">Monthly</Link>
        <Link to="/lifetime" className="hover:text-pink-500 transition-colors">Lifetime</Link>
      </nav>

      {/* Main Payment Card with Pink/Black Neon Aesthetic */}
      <div className="bg-neutral-900 border border-pink-500/30 rounded-2xl p-8 w-full max-w-md glow-effect transition-all duration-300 hover:border-pink-500/70">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 mb-2">
            {data.title}
          </h1>
          <p className="text-neutral-400 text-sm">{data.desc}</p>
          <div className="text-4xl font-extrabold text-white mt-4">{data.price}</div>
        </div>

        {/* Public Asset Loader */}
        <div className="flex justify-center mb-8 bg-black rounded-xl p-4 border border-pink-500/20">
          <img 
            src="/scanner.png" 
            alt="Scan to pay" 
            className="w-48 h-48 object-contain opacity-80 hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Nhbm5lcjwvdGV4dD48L3N2Zz4='; // Fallback if image is missing
            }}
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-white bg-pink-600 hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>

        {result && (
          <div className="mt-4 p-3 rounded bg-neutral-950 border border-pink-500/50 text-pink-400 text-center text-sm font-medium">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

// --- ROUTER ---
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/credits" replace />} />
      <Route path="/credits" element={<PaymentView data={{ id: 'credits', title: 'Buy Credits', price: '$5.00', desc: 'Add 100 credits to your account' }} />} />
      <Route path="/weekly" element={<PaymentView data={{ id: 'weekly', title: 'Weekly Pass', price: '$9.99', desc: '7 days of unrestricted access' }} />} />
      <Route path="/monthly" element={<PaymentView data={{ id: 'monthly', title: 'Monthly Plan', price: '$29.99', desc: 'Best value for regular users' }} />} />
      <Route path="/lifetime" element={<PaymentView data={{ id: 'lifetime', title: 'Lifetime Access', price: '$199.99', desc: 'Pay once, yours forever' }} />} />
    </Routes>
  );
}
