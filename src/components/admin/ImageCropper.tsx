import { useCallback, useEffect, useRef, useState } from "react";

const BOX_W = 320;
const OUT_W = 720;

type Props = {
  src: string;
  aspect?: number;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

/** Кроп и зум изображения: перетаскивание мышью/пальцем, зум колесом и ползунком. */
export function ImageCropper({ src, aspect = 1, onCancel, onApply }: Props) {
  const boxH = Math.round(BOX_W / aspect);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const areaRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const stateRef = useRef({ scale, offset, img });
  stateRef.current = { scale, offset, img };

  useEffect(() => {
    const el = new Image();
    el.onload = () => {
      setImg(el);
      setScale(1);
      setOffset({ x: 0, y: 0 });
    };
    el.src = src;
  }, [src]);

  const base = img ? Math.max(BOX_W / img.naturalWidth, boxH / img.naturalHeight) : 1;

  const clamp = useCallback(
    (next: { x: number; y: number }, s: number) => {
      if (!img) return next;
      const w = img.naturalWidth * base * s;
      const h = img.naturalHeight * base * s;
      const maxX = Math.max(0, (w - BOX_W) / 2);
      const maxY = Math.max(0, (h - boxH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      };
    },
    [img, base, boxH],
  );

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const cur = stateRef.current;
      const next = Math.min(4, Math.max(1, cur.scale * Math.exp(-dy * 0.0015)));
      setScale(next);
      setOffset((o) => clamp({ x: (o.x * next) / cur.scale, y: (o.y * next) / cur.scale }, next));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clamp]);

  const apply = () => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    const outH = Math.round(OUT_W / aspect);
    canvas.width = OUT_W;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const k = OUT_W / BOX_W;
    const dw = img.naturalWidth * base * scale * k;
    const dh = img.naturalHeight * base * scale * k;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, OUT_W, outH);
    ctx.drawImage(img, OUT_W / 2 + offset.x * k - dw / 2, outH / 2 + offset.y * k - dh / 2, dw, dh);
    onApply(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="space-y-4">
      <div
        ref={areaRef}
        className="relative mx-auto overflow-hidden rounded-2xl bg-[oklch(0.94_0.01_60)] touch-none select-none"
        style={{ width: BOX_W, height: boxH, cursor: drag.current ? "grabbing" : "grab" }}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setOffset(clamp({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }, scale));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        {img ? (
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
              width: img.naturalWidth * base * scale,
              height: img.naturalHeight * base * scale,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              maxWidth: "none",
            }}
          />
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[oklch(0.5_0.03_45)]">Масштаб</span>
        <input
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={scale}
          className="h-1.5 flex-1 accent-[oklch(0.6_0.21_27)]"
          onChange={(e) => {
            const next = Number(e.target.value);
            setOffset((o) => clamp({ x: (o.x * next) / scale, y: (o.y * next) / scale }, next));
            setScale(next);
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={apply}
          disabled={!img}
          className="rounded-full bg-[oklch(0.6_0.21_27)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Сохранить фото
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[oklch(0.88_0.03_50)] bg-white px-5 py-2.5 text-sm font-semibold hover:bg-[oklch(0.97_0.02_60)]"
        >
          Отмена
        </button>
      </div>
      <p className="text-xs text-[oklch(0.6_0.03_45)]">Перетащите изображение мышью, масштабируйте колесом или ползунком.</p>
    </div>
  );
}
