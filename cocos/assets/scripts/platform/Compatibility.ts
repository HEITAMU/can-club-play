/** Shared by the Creator scene and both source-runtime entry points. */
export function installCompatibility() {
  const arrays = Array.prototype as any;
  if (typeof arrays.at !== 'function') Object.defineProperty(arrays, 'at', {
    configurable: true, writable: true,
    value: function (index = 0) {
      if (this == null) throw new TypeError('Array.at called without a receiver');
      const values = Object(this);
      const length = Math.min(Math.max(Math.trunc(values.length) || 0, 0), 9007199254740991);
      const relative = Math.trunc(index) || 0;
      const position = relative < 0 ? length + relative : relative;
      return position < 0 || position >= length ? undefined : values[position];
    },
  });
  const runtime = globalThis as any;
  // Frozen game callers clone plain position records. Preserve the existing
  // JSON-data fallback, without claiming support for transferables or DOM data.
  if (typeof runtime.structuredClone !== 'function') runtime.structuredClone = (value: any) =>
    value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

installCompatibility();
