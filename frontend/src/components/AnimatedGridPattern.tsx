"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedGridPattern() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]">
      <svg className="absolute inset-0 h-full w-full stroke-white/5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1">
            <path d="M.5 40V.5H40" fill="none" strokeDasharray="0" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern)" />
      </svg>
      <motion.div
        className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
