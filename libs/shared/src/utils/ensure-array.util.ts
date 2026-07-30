export function ensureArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    if ('data' in val && Array.isArray((val as any).data)) return (val as any).data;
    if ('workers' in val && Array.isArray((val as any).workers)) return (val as any).workers;
    if ('services' in val && Array.isArray((val as any).services)) return (val as any).services;
    if ('units' in val && Array.isArray((val as any).units)) return (val as any).units;
    if ('items' in val && Array.isArray((val as any).items)) return (val as any).items;
    if ('result' in val && Array.isArray((val as any).result)) return (val as any).result;
  }
  return [];
}
