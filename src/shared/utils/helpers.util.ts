export function isDevelopment(): boolean {
  return process.env.NODE_ENV?.startsWith('development') ? true : false;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV?.startsWith('production') ? true : false;
}





   