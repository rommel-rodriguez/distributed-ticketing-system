export function uniqueEmail(prefix = 'e2e'): string {
  const nonce = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  return `${prefix}-${nonce}@example.test`;
}

export function uniqueTicketTitle(prefix = 'concert'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}
