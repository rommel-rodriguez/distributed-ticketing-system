# Ticketing E2E (Playwright)

This folder contains cross-service smoke E2E tests for the ticketing microservices.

## What it validates

- Auth through the ingress edge (`/api/users/...`)
- Ticket creation in `tickets`
- Event propagation from `tickets` -> `orders`
- Order cancellation in `orders`
- Event propagation from `orders` -> `tickets` (ticket unlock)

## Prerequisites

- Docker + Docker Compose
- Node.js 20+

## Run locally

```bash
# from repository root
docker compose -f docker-compose.e2e.yml up -d --build

cd e2e
npm install
BASE_URL=http://127.0.0.1:8080 npm run test:smoke

# back at repository root
docker compose -f docker-compose.e2e.yml down -v --remove-orphans
```

## Notes

- The e2e stack uses `NODE_ENV=test` in services so cookie-based auth works over plain HTTP.
- `stripe-mock` is included to allow the payments service to boot with Stripe configured.
- These are smoke tests by design; expand with heavier journeys later.
