export function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getUserIdFromToken() {
  const payload = decodeJwtPayload(localStorage.getItem("token"));
  return payload?.id ? String(payload.id) : null;
}
