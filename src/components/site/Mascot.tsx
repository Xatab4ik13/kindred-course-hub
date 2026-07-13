import hello from "@/assets/mascot/hello.png";
import wave from "@/assets/mascot/wave.png";
import point from "@/assets/mascot/point.png";
import smile from "@/assets/mascot/smile.png";
import back from "@/assets/mascot/back.png";
import { cn } from "@/lib/utils";

const poses = { hello, wave, point, smile, back } as const;
export type MascotPose = keyof typeof poses;

export function Mascot({
  pose = "hello",
  className,
  size = 200,
}: {
  pose?: MascotPose;
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={poses[pose]}
      alt="CHINAR mascot"
      width={size}
      height={size}
      className={cn("select-none pointer-events-none drop-shadow-xl", className)}
      draggable={false}
    />
  );
}
