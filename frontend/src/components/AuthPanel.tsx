import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function AuthPanel() {
  const { loginWithRedirect, continueAsGuest, isLoading, error } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel mx-auto max-w-xl rounded-[2rem] p-8"
    >
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-rose-500">RomCom Planning</p>
      <h1 className="font-display text-4xl text-rose-950">Build the spark before you write the kiss.</h1>
      <p className="mt-3 text-sm leading-6 text-rose-900/75">
        Generate lead packs, test chemistry, shape a one-line premise, and save novella plans under a guest or linked WebHatchery account.
      </p>

      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white" onClick={loginWithRedirect} disabled={isLoading}>
          Sign In With WebHatchery
        </button>
        <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={() => void continueAsGuest()} disabled={isLoading}>
          Continue as Guest
        </button>
      </div>
    </motion.div>
  );
}
