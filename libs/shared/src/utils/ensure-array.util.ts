export function ensureArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    if ('items' in val && Array.isArray((val as any).items)) {
      return (val as any).items;
    }
    if ('data' in val) {
      const data = (val as any).data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items;
      }
    }
    if ('workers' in val && Array.isArray((val as any).workers)) return (val as any).workers;
    if ('services' in val && Array.isArray((val as any).services)) return (val as any).services;
    if ('units' in val && Array.isArray((val as any).units)) return (val as any).units;
    if ('result' in val && Array.isArray((val as any).result)) return (val as any).result;
  }
  return [];
}
