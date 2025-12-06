// Helper to safely extract an error message as string | undefined
// Works with react-hook-form FieldError or any error-like object
type ErrorLike = {
  message?: unknown;
  msg?: unknown;
  toString?: () => string;
};

export function getErrorMessage(err?: unknown): string | undefined {
  if (!err || typeof err !== 'object' || err === null) return undefined;
  const e = err as ErrorLike;

  if (typeof e.message === 'string' && e.message !== 'undefined')
    return e.message;
  if (typeof e.msg === 'string' && e.msg !== 'undefined') return e.msg;

  if (typeof e.toString === 'function') {
    const s = e.toString();
    if (s && s !== '[object Object]') return s;
  }

  return undefined;
}

export default getErrorMessage;
