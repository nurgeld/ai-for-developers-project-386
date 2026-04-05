/**
 * Get the guest email from cookies
 * @returns The guest email or null if not found
 */
export function getGuestEmail(): string | null {
  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith('guest_email='))
    ?.split('=')[1];
  return raw ? decodeURIComponent(raw) : null;
}