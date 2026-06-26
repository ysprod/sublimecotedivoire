import { useState } from 'react';

export const useLoginForm = (login: (email: string, password: string) => Promise<void>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (error) {
      setError('Une erreur est survenue :' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return { email, password, error, isLoading, handleEmailChange, handlePasswordChange, handleSubmit };
};