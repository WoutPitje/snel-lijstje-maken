import React, { useState } from 'react';
import { account } from '../lib/appwrite';
import { ID } from 'appwrite';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock, UserPlus, User } from 'lucide-react';

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailSession(email, password);
      toast.success('Account succesvol aangemaakt!');
      onSuccess();
    } catch (error) {
      toast.error('Account aanmaken mislukt. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Volledige naam
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="name"
              type="text"
              required
              className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Jan Jansen"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            E-mailadres
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              required
              className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="jouw@email.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Wachtwoord
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              type="password"
              required
              className="block w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimaal 8 karakters</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-gray-800"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Account Aanmaken
            </>
          )}
        </button>
      </form>
    </div>
  );
}