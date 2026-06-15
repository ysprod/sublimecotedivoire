"use client";
import { useAuth } from '@/context/AuthContext';
import { useLoginForm } from '@/hooks/datakwaba/useLoginForm';
import { memo } from 'react';
import LoginHeader from './LoginHeader';
import EmailInput from './EmailInput';
import SubmitButton from './SubmitButton';
import PasswordInput from './PasswordInput';
import RememberMe from './RememberMe';
import SocialLogin from './SocialLogin';
import LoginFooter from './LoginFooter';
import LoginError from './LoginError';

const Login = memo(() => {
  const { login } = useAuth();
  const { email, password, error, isLoading, handleEmailChange, handlePasswordChange, handleSubmit } = useLoginForm(login);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-300">
          <div className="p-8">
            <LoginHeader />
            {error && <LoginError error={error} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <EmailInput email={email} onChange={handleEmailChange} />

              <PasswordInput password={password} onChange={handlePasswordChange} />
              <RememberMe />

              <SubmitButton isLoading={isLoading} />
            </form>
            <SocialLogin />
          </div>

          <LoginFooter />
        </div>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;