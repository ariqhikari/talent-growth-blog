import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { UserPlus, ArrowRight } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Invalid email address';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      await register(name.trim(), email.trim(), password);
      success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toastError(err.message || 'Registration failed');
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
          <h1 className="text-2xl font-serif font-medium text-ink-950">Create your account</h1>
          <p className="text-xs text-ink-600">Start publishing and interacting with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            helperText="Minimum 6 characters"
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
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-6 border-t border-paper-200 text-center">
          <p className="text-xs text-ink-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-0.5"
            >
              <span>Log in</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
