export function getPepper(): string {
  const pepper = process.env.PEPPER;
  if (!pepper) {
    throw new Error('Missing PEPPER in environment variables');
  }
  return pepper;
}