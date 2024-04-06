const { floor } = Math

function parent(index: number) {
  return floor((index - 1) / 2)
}

function childLeft(index: number) {
  return index * 2 + 1
}

function childRight(index: number) {
  return index * 2 + 2
}

export type CompareFn<T> = (a: T, b: T) => number

export class Heap<T> {
  constructor(private compareFn: CompareFn<T>, private nodes: T[] = []) {}

  private siftUp(index: number) {
    const { nodes, compareFn } = this
    while (index > 0) {
      const p = parent(index)
      const nc = nodes[index]!
      const np = nodes[p]!
      if (compareFn(np, nc) <= 0) {
        break
      }
      ;[nodes[index], nodes[p]] = [np, nc]
      index = p
    }
  }

  private siftDown(index: number) {
    const { nodes, compareFn } = this
    const nonLeafCount = floor(nodes.length / 2)
    while (index < nonLeafCount) {
      const l = childLeft(index)
      const r = childRight(index)
      const np = nodes[index]!
      const nl = nodes[l]!
      const nr = nodes[r]!
      const [c, nc] =
        r < nodes.length && compareFn(nl, nr) > 0 ? [r, nr] : [l, nl]
      if (compareFn(np, nc) > 0) {
        ;[nodes[index], nodes[c]] = [nc, np]
        index = c
      } else {
        break
      }
    }
  }

  get length() {
    return this.nodes.length
  }

  push(item: T) {
    const { nodes } = this
    this.siftUp(nodes.push(item) - 1)
  }

  pop(): T | undefined {
    const { nodes } = this
    if (nodes.length < 2) {
      return nodes.pop()
    }
    const result = nodes[0]
    nodes[0] = nodes.pop()!
    this.siftDown(0)
    return result
  }

  peek(): T | undefined {
    return this.nodes[0]
  }

  clone(): Heap<T> {
    return new Heap<T>(this.compareFn, [...this.nodes])
  }

  /**
   * Faster than doing `push` then `pop` separately.
   */
  pushpop(item: T): T {
    const { nodes, compareFn } = this
    if (nodes.length === 0) return item
    if (compareFn(nodes[0]!, item) > 0) return item
    const top = nodes[0]!
    nodes[0] = item
    this.siftDown(0)
    return top
  }

  /**
   * Faster than doing `pop` then `push` separately.
   */
  replace(item: T): T {
    const { nodes } = this
    const top = nodes[0]!
    nodes[0] = item
    this.siftDown(0)
    return top
  }

  /**
   * Removes one item from the heap which matches the predicate.
   */
  remove(predicate: (item: T) => boolean) {
    const { nodes } = this
    const index = nodes.findIndex(predicate)
    if (index === -1) return undefined
    if (index === nodes.length - 1) return nodes.pop()
    const item = nodes[index]
    nodes[index] = nodes.pop()!
    this.siftDown(index)
    return item
  }

  /**
   * Reorders the heap using a `newCompareFn`.
   * @param items
   */
  reorder(newCompareFn: CompareFn<T>) {
    this.compareFn = newCompareFn ?? this.compareFn
    for (let i = parent(this.nodes.length - 1); i >= 0; --i) {
      this.siftDown(i)
    }
  }

  /**
   * Allows in-order iteration over stored items. Does NOT consume the heap, clones instead.
   */
  *[Symbol.iterator]() {
    const heap = this.clone()
    while (heap.length > 0) {
      yield heap.pop()
    }
  }

  /**
   * Allows in-order iteration over stored items. Consumes the heap in the process.
   */
  *consume() {
    const { nodes } = this
    while (nodes.length > 0) {
      yield this.pop() as T
    }
  }

  /**
   * Creates a heap from an iterable.
   */
  static from<T>(iterable: Iterable<T>, compareFn: CompareFn<T>): Heap<T> {
    const heap = new Heap<T>(compareFn)
    heap.nodes = [...iterable]
    heap.reorder(compareFn)
    return heap
  }
}

export const _testingExports = {
  parent,
  childLeft,
  childRight,
}
