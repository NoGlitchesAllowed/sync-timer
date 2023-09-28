import { connection } from "./connection";
import { createRenderer } from "./render";

export const renderText = createRenderer(10, (n, ctx) => {
  const text = `${n % 10000}`.padStart(4, '0');
  ctx.fillStyle = 'rgb(0,0,255)';
  ctx.fillRect(320, 0, 160, 28);
  ctx.fillStyle = connection.isConnected() ? 'white' : 'red';
  ctx.font = '22px Roboto Mono';
  ctx.fillText(text, 422, 18);
})