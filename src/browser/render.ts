import { connection } from "./connection";
import { artificialOffset } from "./artificialOffset";
import { renderBinary } from "./renderBinary";
import { renderText } from "./renderText";

const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 480;
canvas.height = 20;
const ctx = canvas.getContext('2d')!;
let lastTimestamp: number | undefined;

export function render(timestamp: number) {
  try {
    render0(timestamp);
  } finally {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(render);
  }
}

function render0(timestamp: number) {
  if (lastTimestamp === undefined) return;
  const frameTime = timestamp - lastTimestamp;
  const time = Date.now() + connection.getOffset() + artificialOffset + frameTime * 2;
  renderBinary(time, ctx);
  renderText(time, ctx);
}

export function createRenderer(
  fps: number,
  handler: (n: number, ctx: CanvasRenderingContext2D) => void
) {
  let last: number | undefined
  return (time: number, ctx: CanvasRenderingContext2D) => {
    const n = Math.floor(time / 1000 * fps)
    if (n === last) return
    last = n
    handler(n, ctx)
  }
}