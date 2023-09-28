import { getErrorCorrectionCode } from "./hammingCode";
import { createRenderer } from "./render";

export const renderBinary = createRenderer(1, (n, ctx) => {
  const code = getErrorCorrectionCode(n % 2048);
  const colors = ['white', 'black', 'blue']
  for (let i = 0; i < 16; i++) {
    const offColor = colors[i % 3]
    const onColor = colors[(i+1) % 3]
    ctx.fillStyle = code[i] ? offColor : onColor;
    ctx.fillRect(i * 20, 0, 20, 20);
  }
})