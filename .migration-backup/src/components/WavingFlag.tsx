"use client";

export default function WavingFlag({ emoji }: { emoji: string }) {
  return (
    <div className="waving-flag pointer-events-none absolute -right-6 -top-6 select-none opacity-25 transition-opacity duration-500 group-hover:opacity-45">
      <span className="inline-block text-[110px] leading-none drop-shadow-2xl">
        {emoji}
      </span>
      <style jsx>{`
        .waving-flag {
          transform-origin: top left;
          animation: wave 4.5s ease-in-out infinite;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4));
        }
        @keyframes wave {
          0%,100% { transform: perspective(600px) rotateY(-8deg) rotateX(0deg) skewY(0deg); }
          25%     { transform: perspective(600px) rotateY(-2deg) rotateX(3deg) skewY(-2deg); }
          50%     { transform: perspective(600px) rotateY(6deg)  rotateX(-2deg) skewY(1deg); }
          75%     { transform: perspective(600px) rotateY(-4deg) rotateX(2deg) skewY(-1deg); }
        }
      `}</style>
    </div>
  );
}
