import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Heap for Typescript',
      fileName: 'heap-ts',
    },
  },
  plugins: [dts()],
})
