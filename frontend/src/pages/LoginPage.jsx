import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LogIn, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Invalid email address';

    if (!password) errs.password = 'Password is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      await login(email.trim(), password);
      success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-paper-50 border border-paper-300 rounded-2xl p-8 shadow-tactile-sm text-left">
        {/* Header */}
        <div className="mb-6 text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-ink-900 text-paper-50 flex items-center justify-center font-serif text-lg mx-auto mb-3 shadow-tactile-sm">
            T
          </div>
          <h1 className="text-2xl font-serif font-medium text-ink-950">Welcome back</h1>
          <p className="text-xs text-ink-600">Enter your credentials to manage your stories</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={isLoading}
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-paper-200 text-center">
          <p className="text-xs text-ink-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-0.5"
            >
              <span>Create one</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
