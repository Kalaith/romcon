import { AnimatePresence, motion } from 'framer-motion';

type ConfirmRegenerateModalProps = {
  isOpen: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmRegenerateModal({
  isOpen,
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmRegenerateModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close regeneration confirmation"
            className="fixed inset-0 z-40 bg-rose-950/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            type="button"
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <div className="w-full max-w-lg rounded-[2rem] border border-white/80 bg-[#fff8f3] p-6 shadow-[0_30px_90px_rgba(88,32,43,0.26)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Confirm Regeneration</p>
              <h2 className="mt-2 font-display text-3xl text-rose-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-rose-900/80">{body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800" onClick={onCancel} type="button">
                  Keep Current Version
                </button>
                <button className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white" onClick={onConfirm} type="button">
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
