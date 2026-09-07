/**
 * A tiny localStorage-backed external store for `useSyncExternalStore`.
 *
 * Reading persisted state inside an effect and calling `setState` causes the
 * cascading render the `react-hooks/set-state-in-effect` rule warns about.
 * Subscribing to an external system is what `useSyncExternalStore` is for, so
 * that is what this wraps.
 *
 * The snapshot is cached against the raw string, which matters: React calls
 * `getSnapshot` on every render and bails out of updates by reference, so
 * returning a freshly parsed object each time would loop forever.
 */

export interface LocalStore<T> {
  subscribe: (onChange: () => void) => () => void;
  /** Value on the client, parsed from storage. */
  getSnapshot: () => T;
  /** Value during SSR and the hydration pass. */
  getServerSnapshot: () => T;
  set: (value: T) => void;
  update: (fn: (current: T) => T) => void;
}

export function createLocalStore<T>({
  key,
  parse,
  serverValue,
  serialize = (value) => JSON.stringify(value),
}: {
  key: string;
  /** Turn the stored string (or null) into a value. Must never throw. */
  parse: (raw: string | null) => T;
  /** What to render before storage is readable. */
  serverValue: T;
  /**
   * Turn a value back into the stored string. Return `null` to clear the
   * entry. Needed when the in-memory value wraps the persisted one — an
   * auth session carries a `ready` flag that has no business on disk.
   */
  serialize?: (value: T) => string | null;
}): LocalStore<T> {
  const listeners = new Set<() => void>();

  let rawCache: string | null = null;
  let valueCache: T = parse(null);
  let primed = false;

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Private windows and "block site data" throw on access.
      return null;
    }
  }

  function getSnapshot(): T {
    const raw = readRaw();
    if (!primed || raw !== rawCache) {
      rawCache = raw;
      valueCache = parse(raw);
      primed = true;
    }
    return valueCache;
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  function subscribe(onChange: () => void) {
    listeners.add(onChange);
    // Keep other tabs of the same workspace in step.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === key) onChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  }

  function set(value: T) {
    valueCache = value;
    primed = true;
    try {
      const raw = serialize(value);
      rawCache = raw;
      if (raw === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, raw);
    } catch {
      // Quota, or storage blocked. The in-memory value still stands for this
      // session; it just will not survive a reload. Keep `rawCache` aligned
      // with what a subsequent read would return so the cache does not
      // silently serve a stale value.
      rawCache = readRaw();
    }
    emit();
  }

  function update(fn: (current: T) => T) {
    set(fn(getSnapshot()));
  }

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot: () => serverValue,
    set,
    update,
  };
}

/**
 * Stores are keyed by storage key and reused, so two components reading the
 * same key share one cache and one subscriber list.
 */
export function memoStore<T>(
  registry: Map<string, LocalStore<T>>,
  key: string,
  make: () => LocalStore<T>,
): LocalStore<T> {
  const existing = registry.get(key);
  if (existing) return existing;
  const created = make();
  registry.set(key, created);
  return created;
}
