type ProtectedRouteInput = {
  hasUser: boolean;
  pathname: string;
};

export function getProtectedRouteRedirect({
  hasUser,
  pathname,
}: ProtectedRouteInput) {
  if (hasUser || !isProtectedAppRoute(pathname)) {
    return null;
  }

  const params = new URLSearchParams({
    next: pathname,
  });

  return `/auth/login?${params.toString()}`;
}

function isProtectedAppRoute(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/");
}
