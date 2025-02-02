// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// @ts-nocheck Bypass static errors for missing --unstable.
// This module is browser compatible.

export interface DelayOptions {
  signal?: AbortSignal;
  /** Indicates whether the process should continue to run as long as the timer exists. This is `true` by default. */
  persistent?: boolean;
}

/* Resolves after the given number of milliseconds. */
export function delay(ms: number, options: DelayOptions = {}): Promise<void> {
  const { signal, persistent } = options;
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Delay was aborted.", "AbortError"));
  }
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(i);
      reject(new DOMException("Delay was aborted.", "AbortError"));
    };
    const done = () => {
      signal?.removeEventListener("abort", abort);
      resolve();
    };
    const i = setTimeout(done, ms);
    signal?.addEventListener("abort", abort, { once: true });
    if (persistent === false) {
      Deno.unrefTimer(i);
    }
  });
}
