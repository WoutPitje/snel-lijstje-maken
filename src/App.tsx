import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Models } from 'appwrite';
import { account } from './lib/appwrite';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HomePage from './components/HomePage';
import { KeyRound, UserPlus, Loader2, ListChecks } from 'lucide-react';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <HomePage user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <ListChecks className="h-6 w-6 text-teal-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Snel Lijstje Maken</h1>
          <h2 className="text-xl font-bold text-white mb-1">
            {isLogin ? 'Welkom terug!' : 'Maak een account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? 'Log in op je account' : 'Begin met je gratis account'}
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm onSuccess={checkSession} />
        ) : (
          <SignupForm onSuccess={checkSession} />
        )}
        
        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Nog geen account?" : 'Al een account?'}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-teal-500 hover:text-teal-400"
          >
            {isLogin ? 'Registreer je' : 'Log in'}
          </button>
        </p>
      </div>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;