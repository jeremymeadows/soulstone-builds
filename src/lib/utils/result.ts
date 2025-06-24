export class Result<T, E = Error> {
  private result: { ok: true; value: T } | { ok: false; error: E };

  constructor(ok: boolean, data: T | E) {
    if (ok) {
      this.result = { ok: ok, value: data as T };
    } else {
      this.result = { ok: ok, error: data as E };
    }
  }

  static Ok<T>(value: T): Result<T, any> {
    return new Result(true, value);
  }

  static Err<E>(error: E): Result<any, E> {
    return new Result(false, error);
  }

  static from<T, E>(value: T | null | undefined, err?: E): Result<T, E | Error> {
    if (value === null || value === undefined || value instanceof Error) {
      return Result.Err(err ?? new Error());
    } else {
      return Result.Ok(value);
    }
  }

  get ok(): boolean {
    return this.result.ok;
  }

  get value(): T {
    if (!this.result.ok) {
      throw new Error("Tried to read value of an error result");
    }
    return this.result.value;
  }

  get error(): E {
    if (this.result.ok) {
      throw new Error("Tried to read error of a success result");
    }
    return this.result.error;
  }

  expect(): T {
    if (!this.result.ok) {
      throw this.result.error;
    }
    return this.result.value;
  }

  value_or(val: T): T {
    return this.result.ok ? this.result.value : val;
  }

  match<R>({ ok, err }: { ok: (value: T) => R; err: (error: E) => R }): R {
	  return this.result.ok ? ok(this.result.value) : err(this.result.error);
  }
}
