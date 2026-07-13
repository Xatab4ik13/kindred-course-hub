import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import hello from "@/assets/mascot/hello.png";
import wave from "@/assets/mascot/wave.png";
import point from "@/assets/mascot/point.png";
import smile from "@/assets/mascot/smile.png";
import back from "@/assets/mascot/back.png";
import angry from "@/assets/mascot/angry.png";
import sad from "@/assets/mascot/sad.png";
import calm from "@/assets/mascot/calm.png";
import side from "@/assets/mascot/side.png";
import { cn } from "@/lib/utils";

const poses = { hello, wave, point, smile, back, angry, sad, calm, side } as const;
export type MascotPose = keyof typeof poses;

/**
 * Mascot with idle breathing + optional cursor eye-tracking.
 * Set `interactive` to make the tiger subtly follow the cursor and react to hover.
 */
export function Mascot({
  pose = "hello",
  className,
  size = 200,
  interactive = false,
  breathe = true,
}: {
  pose?: MascotPose;
  className?: string;
  size?: number;
  interactive?: boolean;
  breathe?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // raw pointer delta from mascot center, normalized to [-1, 1]
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.6 });

  const rotate = useTransform(sx, [-1, 1], [-6, 6]);
  const tx = useTransform(sx, [-1, 1], [-6, 6]);
  const ty = useTransform(sy, [-1, 1], [-4, 4]);

  useEffect(() => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / Math.max(window.innerWidth * 0.4, 300);
      const dy = (e.clientY - cy) / Math.max(window.innerHeight * 0.5, 300);
      mx.set(Math.max(-1, Math.min(1, dx)));
      my.set(Math.max(-1, Math.min(1, dy)));
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, mx, my]);

  return (
    <motion.div
      ref={ref}
      style={interactive ? { rotate, x: tx, y: ty } : undefined}
      animate={breathe ? { scale: [1, 1.025, 1] } : undefined}
      transition={
        breathe
          ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      className={cn("inline-block will-change-transform", className)}
    >
      <img
        src={poses[pose]}
        alt="CHINAR mascot"
        width={size}
        height={size}
        className="select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(120,20,10,0.25)]"
        draggable={false}
        style={{ width: size, height: "auto" }}
      />
    </motion.div>
  );
}
