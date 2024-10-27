import React, { useState } from 'react';
import { Models } from 'appwrite';
import { account } from '../lib/appwrite';
import { LogOut, User, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TaskList from './TaskList';

interface HomePageProps {
  user: Models.User<Models.Preferences>;
  onLogout: () => void;
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      onLogout();
      toast.success('Succesvol uitgelogd');
    } catch (error) {
      toast.error('Uitloggen mislukt');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welkom, {user.name}!</h1>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-gray-400 hover:text-teal-500 flex items-center text-sm mt-1 focus:outline-none"
                >
                  {showDetails ? 'Verberg' : 'Toon'} accountgegevens
                  {showDetails ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 focus:outline-none"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Uitloggen
            </button>
          </div>
          
          {showDetails && (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Accountgegevens</h2>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Gebruikers-ID</dt>
                  <dd className="mt-1 text-sm text-gray-300">{user.$id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Account Aangemaakt</dt>
                  <dd className="mt-1 text-sm text-gray-300">
                    {new Date(user.$createdAt).toLocaleDateString('nl-NL')}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <TaskList userId={user.$id} />
        </div>
      </div>
    </div>
  );
}