import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 500 * 60 * 1000,
    // testTimeout: 5 * 1000,
  },
})