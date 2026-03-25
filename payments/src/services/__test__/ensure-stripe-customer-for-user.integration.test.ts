import { ensureStripeCustomerForUser } from '../../services/ensure-stripe-customer-for-user';
import { StripeCustomer } from '../../models/stripe-customer';

it('deduplicates concurrent customer creation for same user', async () => {
  const userId = 'user-123';
  const email = 'user@example.com';

  // Important: blast concurrent calls to exercise race handling + unique indexes
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      ensureStripeCustomerForUser({ userId, email }),
    ),
  );

  const uniqueIds = [...new Set(results.map((r) => r.stripeCustomerId))];
  expect(uniqueIds).toHaveLength(1);

  const rowCount = await StripeCustomer.countDocuments({ userId });
  expect(rowCount).toBe(1);
});
