import { test, expect } from 'vitest'
import { Heap, _testingExports } from './heap'

const compareNumbers = (a: number, b: number) => a - b

const { childLeft, childRight, parent } = _testingExports

test('parent(child(index)) === index', () => {
  for (let i = 0; i < 1000; ++i) {
    expect(parent(childLeft(i))).toBe(i)
    expect(parent(childRight(i))).toBe(i)
  }
})

test('child(parent(index)) === index', () => {
  // odd / left
  for (let i = 1; i < 1000; i += 2) {
    expect(childLeft(parent(i))).toBe(i)
  }
  // even / right
  for (let i = 2; i < 1000; i += 2) {
    expect(childRight(parent(i))).toBe(i)
  }
})

test('basics: push / peek / pop / iteration', () => {
  const heap = new Heap(compareNumbers)
  heap.push(2)
  expect(heap.peek()).toBe(2)
  heap.push(3)
  expect(heap.peek()).toBe(2)
  heap.push(1)
  expect(heap.peek()).toBe(1)
  heap.push(4)
  heap.push(6)
  heap.push(2)
  heap.push(7)
  heap.push(8)
  expect(heap.peek()).toBe(1)
  heap.push(1)
  expect(heap.pop()).toBe(1)
  expect(heap.peek()).toBe(1)
  heap.push(-1)
  expect(heap.peek()).toBe(-1)
  expect([...heap]).toEqual([-1, 1, 2, 2, 3, 4, 6, 7, 8])
})

test('from', () => {
  function* generator() {
    yield* [2, 3, 1, 4, 6, 2, 7, 8, 1, -1]
  }
  expect([...Heap.from(generator(), compareNumbers)]).toEqual([
    -1, 1, 1, 2, 2, 3, 4, 6, 7, 8,
  ])
})

test('compareNumbers', () => {
  // prettier-ignore
  expect([
    ...Heap.from([{x:2}, {x:3}, {x:1}, {x:4}, {x:6}, {x:2}, {x:7}, {x:8}, {x:1}, {x:-1}], (a, b) => a.x - b.x),
  ]).toEqual([{x:-1}, {x:1}, {x:1}, {x:2}, {x:2}, {x:3}, {x:4}, {x:6}, {x:7}, {x:8}])
})

test('random numbers compare to sort', () => {
  const numbers = Array.from({ length: 1000 }).map(() => Math.random())
  expect([...Heap.from(numbers, compareNumbers)]).toEqual(
    [...numbers].sort(compareNumbers)
  )
})

test('from does NOT modify input array', () => {
  const numbers = [4, 3, 2, 1]
  Heap.from(numbers, compareNumbers)
  expect(numbers).toEqual([4, 3, 2, 1])
})

test('`undefined` is a valid value', () => {
  const compareNumbersUndefined = (
    a: number | undefined,
    b: number | undefined
  ) => (a ?? Number.POSITIVE_INFINITY) - (b ?? Number.POSITIVE_INFINITY)
  const numbers = [undefined, 4, 3, undefined, 2, 1, undefined]
  // prettier-ignore
  expect([...Heap.from(numbers, compareNumbersUndefined)]).toEqual([1, 2, 3, 4, undefined, undefined, undefined])
})

test('can be iterated many times (iterator does not consume the heap)', () => {
  const numbers = [4, 3, 2, 1]
  const heap = Heap.from(numbers, compareNumbers)
  expect([...heap]).toEqual([1, 2, 3, 4])
  expect([...heap]).toEqual([1, 2, 3, 4])
  expect([...heap]).toEqual([1, 2, 3, 4])
})

test('`consume` consumes the heap', () => {
  const numbers = [4, 3, 2, 1]
  const heap = Heap.from(numbers, compareNumbers)
  expect([...heap.consume()]).toEqual([1, 2, 3, 4])
  expect([...heap]).toEqual([])
})

test('pushpop is equal to push then pop', () => {
  const heap1 = new Heap(compareNumbers)
  const heap2 = new Heap(compareNumbers)
  for (let i = 0; i < 1000; ++i) {
    const item = Math.random()
    heap1.push(item)
    heap2.push(item)
  }
  for (let i = 0; i < 1000; ++i) {
    const item = Math.random()
    expect((heap1.push(item), heap1.pop())).toBe(heap2.pushpop(item))
  }
})

test('replace is equal to pop then push', () => {
  const heap1 = new Heap(compareNumbers)
  const heap2 = new Heap(compareNumbers)
  for (let i = 0; i < 1000; ++i) {
    const item = Math.random()
    heap1.push(item)
    heap2.push(item)
  }
  for (let i = 0; i < 1000; ++i) {
    const item = Math.random()
    const top = heap1.pop()
    heap1.push(item)
    expect(top).toBe(heap2.replace(item))
  }
})

test('peek returns undefined if empty', () => {
  expect(new Heap(compareNumbers).peek()).toBe(undefined)
})

test('remove item', () => {
  const heap = Heap.from([1, 4, 8, 2, 3, 6, 5, 7], compareNumbers)
  expect(heap.remove((item) => item === 2)).toBe(2)
  expect([...heap]).toEqual([1, 3, 4, 5, 6, 7, 8])
  expect(heap.remove((item) => item === 8)).toBe(8)
  expect([...heap]).toEqual([1, 3, 4, 5, 6, 7])
  expect(heap.remove((item) => item === 1)).toBe(1)
  expect([...heap]).toEqual([3, 4, 5, 6, 7])
  expect(heap.remove((item) => item % 3 === 0)).toBe(3)
  expect([...heap]).toEqual([4, 5, 6, 7])
})

test('remove item from the end', () => {
  const heap = Heap.from([1, 4, 2, 3, 6, 5, 7, 8], compareNumbers)
  expect(heap.remove((item) => item === 8)).toBe(8)
  expect([...heap]).toEqual([1, 2, 3, 4, 5, 6, 7])
})

test('reorder with a new compare fn', () => {
  const heap = Heap.from([1, 4, 2, 3, 6, 5, 7, 8], compareNumbers)
  expect([...heap]).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  heap.reorder((a, b) => b - a)
  expect([...heap]).toEqual([8, 7, 6, 5, 4, 3, 2, 1])
})
