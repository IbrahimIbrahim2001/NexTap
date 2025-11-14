"use client";
import { Particles } from '@/components/ui/particles'
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
// type ColorProps = {

// }

export default function ParticlesTheme() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor((resolvedTheme === "dark") ? "#3c83f6" : "")
  }, [resolvedTheme])

  return (
    <Particles
      className="absolute inset-0 z-0"
      quantity={100}
      ease={80}
      color={color}
      refresh
    />
  )
}
