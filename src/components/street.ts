export function streetSurface(x: number, width: number, height: number) {
  const rise = Math.sin(Math.PI * x / width) ** 2;
  return height * (.963 - rise * .025);
}
