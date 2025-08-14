import React from "react";
const QuantumFallback: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`rounded-2xl ring-1 ring-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 ${className}`}
  >
    <div className="w-full h-full grid place-items-center">
      <div className="text-center">
        <div className="text-white/70 text-sm">
          Interactive preview unavailable
        </div>
        <div className="text-white/40 text-xs">
          WebGL disabled or reduced motion enabled
        </div>
      </div>
    </div>
  </div>
);
export default QuantumFallback;
