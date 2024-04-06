# Binary Heap for TypeScript

Minimal binary heap implementation for TypeScript using modern syntax and module system.

Examples:

```typescript
const compareFn = (a: number, b: number) => a - b

// create from an iterable O(N), does not modify input
const heap = Heap.from([1, 3, 2, 4, 6, 5], compareFn)

// constructor-style
const heap = new Heap(compareFn)

// methods
heap.clone()
heap.push(1)
heap.pop()
heap.pushpop(2) // faster than push + pop
heap.replace(3) // faster than pop + push
heap.peek()
heap.reorder((a, b) => b - a) // O(N) change comparator function
heap.remove((item) => item === x) // remove one item which matches a predicate
heap.length

// iteration does NOT consume the heap, it creates a copy
for (const item of heap) {
  // ...
}
// in case you really want to consume it:
for (const item of heap.consume()) {
  // ...
}
```

# Development

```
pnpm install
pnpm test
pnpm build
```
