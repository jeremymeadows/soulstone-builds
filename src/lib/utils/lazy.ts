export class Lazy<T> {
  private initializer: () => T;
  private data: T | null = null;

  constructor(fn: () => T) {
    this.initializer = fn;
  }

  valueOf(): T {
    if (!this.data) {
      this.data = this.initializer();
    }
    return this.data;
  }
}
