export function buildAuthCallbackUrl(params: {
  nextPath: string;
  origin: string;
}) {
  const url = new URL("/auth/confirm", params.origin);

  url.searchParams.set("next", params.nextPath);

  return url.toString();
}

export function getSafePostAuthPath(
  nextPath: string | null | undefined,
  fallbackPath: string,
) {
  if (!nextPath) {
    return fallbackPath;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallbackPath;
  }

  return nextPath;
}
