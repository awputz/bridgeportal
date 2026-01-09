import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

interface FilterConfig<T> {
  key: string;
  defaultValue: T;
  parse?: (value: string | null) => T;
  serialize?: (value: T) => string | undefined;
}

type FilterConfigs<T extends Record<string, unknown>> = {
  [K in keyof T]: FilterConfig<T[K]>;
};

/**
 * Custom hook to sync filter state with URL search params
 * Provides persistence across page refreshes and shareable URLs
 */
export function useURLFilters<T extends Record<string, unknown>>(
  configs: FilterConfigs<T>
): [T, (updates: Partial<T>) => void, () => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result = {} as T;
    for (const [filterKey, config] of Object.entries(configs) as [keyof T, FilterConfig<T[keyof T]>][]) {
      const value = searchParams.get(config.key);
      if (config.parse) {
        result[filterKey] = config.parse(value);
      } else {
        result[filterKey] = (value ?? config.defaultValue) as T[keyof T];
      }
    }
    return result;
  }, [searchParams, configs]);

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          for (const [filterKey, config] of Object.entries(configs) as [keyof T, FilterConfig<T[keyof T]>][]) {
            if (filterKey in updates) {
              const value = updates[filterKey];
              const serialized = config.serialize
                ? config.serialize(value as T[keyof T])
                : String(value);

              // Only set param if different from default
              if (
                serialized &&
                serialized !== String(config.defaultValue) &&
                serialized !== ""
              ) {
                newParams.set(config.key, serialized);
              } else {
                newParams.delete(config.key);
              }
            }
          }
          return newParams;
        },
        { replace: true }
      );
    },
    [setSearchParams, configs]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return [filters, setFilters, clearFilters];
}

// Convenience parse/serialize functions
export const parseNumber = (defaultValue: number) => (value: string | null) =>
  value ? parseInt(value, 10) : defaultValue;

export const parseString = (defaultValue: string) => (value: string | null) =>
  value || defaultValue;
