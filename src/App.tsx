import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';

// --- SHARED COMPONENT ---
function PaymentView({ data }: { data: { id: string; title: string; subtitle: string; instruction: string } }) {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: data.id,
          amount,
          transactionId,
          username
        })
      });
      
      if (!res.ok) throw new Error('Failed');
      
      setResult({
        type: 'success',
        text: 'Payment details submitted! After verifying, your credits/plan will be added.'
      });
      
      // Clear form on success
      setAmount('');
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
      {/* Main Payment Card matching image_6f5b83.png */}
      <div className="bg-[#12101a] border border-gray-800/60 rounded-xl p-6 md:p-8 w-full max-w-md shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{data.title}</h1>
          <p className="text-gray-400 text-sm">{data.subtitle}</p>
        </div>

        {/* QR Code Segment */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/scanner.png" 
            alt="QR Code" 
            className="w-48 h-48 object-contain rounded-lg mb-4 bg-black border border-gray-800"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Nhbm5lcjwvdGV4dD48L3N2Zz4=';
            }}
          />
          <p className="text-gray-400 text-sm">Pay the money here</p>
          <p className="text-white font-bold text-base mt-1">{data.instruction}</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-xs font-bold mb-2">Amount Paid</label>
            <input
              type="text"
              required
              placeholder="Enter amount paid in INR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0a0910] border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white text-xs font-bold mb-2">Transaction ID</label>
            <input
              type="text"
              required
              placeholder="Enter your UPI Txn ID / UTR"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-[#0a0910] border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
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
              className="w-full bg-[#0a0910] border border-gray-800 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Payment Details'}
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

// --- ROUTER (No top navigation) ---
export default function App() {
  const baseData = { title: 'INR Payment', subtitle: 'Complete your transaction using the QR code below.' };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/credits" replace />} />
      <Route path="/credits" element={<PaymentView data={{ ...baseData, id: 'credits', instruction: 'Each credit - 2rs' }} />} />
      <Route path="/weekly" element={<PaymentView data={{ ...baseData, id: 'weekly', instruction: 'Weekly Pass - 199rs' }} />} />
      <Route path="/monthly" element={<PaymentView data={{ ...baseData, id: 'monthly', instruction: 'Monthly Plan - 599rs' }} />} />
      <Route path="/lifetime" element={<PaymentView data={{ ...baseData, id: 'lifetime', instruction: 'Lifetime Access - 1999rs' }} />} />
    </Routes>
  );
}
