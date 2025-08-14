import { memo, useEffect, useState } from "react";

function useIdle(callback: () => void) {
  useEffect(() => {
    const schedule = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback
      : (fn: any) => setTimeout(fn, 200);
    const cancel = (window as any).cancelIdleCallback
      ? (id: any) => (window as any).cancelIdleCallback(id)
      : (id: any) => clearTimeout(id);
    const id = schedule(callback);
    return () => cancel(id);
  }, [callback]);
}

const HeroInteractive = memo(function HeroInteractive() {
  const [ready, setReady] = useState(false);
  useIdle(() => setReady(true));

  return (
    <div className="mt-6 mx-auto max-w-md">
      <button
        className="w-full rounded-2xl px-5 py-3 bg-white text-black font-semibold shadow hover:opacity-90 transition"
        onClick={() => import("./heavy-logic").then((m) => m.run())}
        aria-label="Start growth audit"
      >
        Get a free 3-step Growth Audit
      </button>
      {!ready && (
        <p className="mt-2 text-xs opacity-70">Optimizing for speed…</p>
      )}
    </div>
  );
});

export default HeroInteractive;
