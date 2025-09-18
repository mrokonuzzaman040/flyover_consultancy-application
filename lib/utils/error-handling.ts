/**
 * Safely extracts an error message from various error response formats
 * Ensures we always return a string for toast notifications
 */
export function getErrorMessage(error: any, fallback = 'An error occurred'): string {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    return error.message;
  }

  // If it's an object with common error properties
  if (error && typeof error === 'object') {
    // Check for common error message properties
    if (typeof error.message === 'string') {
      return error.message;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (typeof error.details === 'string') {
      return error.details;
    }
    
    // If error.error is an object, try to extract a meaningful message
    if (error.error && typeof error.error === 'object') {
      if (typeof error.error.message === 'string') {
        return error.error.message;
      }
    }
  }

  // Return fallback message
  return fallback;
}

/**
 * Safely extracts error message from API response
 * Handles both JSON parsing and error extraction
 */
export async function getApiErrorMessage(response: Response, fallback = 'Request failed'): Promise<string> {
  try {
    const errorData = await response.json();
    return getErrorMessage(errorData, fallback);
  } catch {
    // If JSON parsing fails, return fallback
    return fallback;
  }
}
