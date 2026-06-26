// app/logout/components/RippleEffect.tsx
'use client';

export function RippleEffect() {
  return (
    <>
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute inset-0 border-2 border-green-400 rounded-full"
          style={{
            animation: `ripple 1.2s ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  );
}