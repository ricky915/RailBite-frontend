import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLogin } from '@/features/auth/hooks/useLogin';

/**
 * Page component: login (Section 6.2 — composes feature components, owns
 * the layout for its route, delegates all logic to hooks).
 */
export default function LoginPage(): JSX.Element {
  const location = useLocation();
  const state = location.state as { returnUrl?: string } | null;
  const { login, isPending, error } = useLogin(state?.returnUrl);

  return (
    <>
      <Helmet>
        <title>Log in — RailBite</title>
        <meta name="description" content="Log in to RailBite to order food to your train seat." />
      </Helmet>
      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">Log in to RailBite</h1>
        <LoginForm onSubmit={login} isSubmitting={isPending} serverError={error} />
      </div>
    </>
  );
}
