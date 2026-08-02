/**
  Extracts human-readable error messages from API error objects,
  supporting ASP.NET ProblemDetails RFC 9110 validation errors dicts ({ errors: { FieldName: ["Error string"] } }),
  custom response messages ({ message: "..." }), and raw string errors.
 */
export function extractErrorMessage(err: any, fallback = 'Something went wrong. Please try again.'): string {
  if (!err) return fallback;

  const errorObj = err.error ?? err;

  // 1. ASP.NET RFC 9110 / ProblemDetails validation errors dictionary:
  // e.g. { errors: { Token: ["The Token field is required."], Phone: ["Invalid phone"] } }
  if (errorObj?.errors && typeof errorObj.errors === 'object') {
    const messages: string[] = [];
    for (const key of Object.keys(errorObj.errors)) {
      const fieldErrors = errorObj.errors[key];
      if (Array.isArray(fieldErrors)) {
        messages.push(...fieldErrors);
      } else if (typeof fieldErrors === 'string') {
        messages.push(fieldErrors);
      }
    }
    if (messages.length > 0) {
      return messages.join(' ');
    }
  }

  // 2. Check for message / detail / title properties
  if (errorObj?.message && typeof errorObj.message === 'string') {
    return errorObj.message;
  }
  if (errorObj?.detail && typeof errorObj.detail === 'string') {
    return errorObj.detail;
  }
  if (
    errorObj?.title &&
    typeof errorObj.title === 'string' &&
    errorObj.title !== 'One or more validation errors occurred.'
  ) {
    return errorObj.title;
  }

  // 3. Check if errorObj itself is a string
  if (typeof errorObj === 'string' && errorObj.trim()) {
    return errorObj;
  }

  return fallback;
}
