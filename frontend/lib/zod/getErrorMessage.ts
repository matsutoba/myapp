// Helper to safely extract an error message as string | undefined
// Works with react-hook-form FieldError or any error-like object
export function getErrorMessage(err?: unknown): string | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const anyErr = err as any;
  const msg = anyErr?.message ?? anyErr?.msg ?? anyErr?.toString?.();
  if (typeof msg === 'string' && msg !== 'undefined') return msg;
  return undefined;
}

export default getErrorMessage;
