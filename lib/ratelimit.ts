// Simple in-memory rate limiter for development
// In production, use Redis or a proper rate limiting service

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

class InMemoryRateLimit {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = identifier;
    const existing = this.requests.get(key);

    // Clean up expired entries
    if (existing && now > existing.resetTime) {
      this.requests.delete(key);
    }

    const current = this.requests.get(key) || { count: 0, resetTime: now + this.windowMs };
    
    if (current.count >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: current.resetTime
      };
    }

    current.count++;
    this.requests.set(key, current);

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - current.count,
      reset: current.resetTime
    };
  }
}

export const ratelimit = {
  limit: (identifier: string) => new InMemoryRateLimit(5, 60000).checkLimit(identifier)
};