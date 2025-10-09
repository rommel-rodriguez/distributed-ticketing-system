# Partial test for Stripe Payment Intents flow: Just testing the Webhook
.PHONY: test-webhook
test-webhook:
	echo "Sending PaymentSucceeded Event to Stripe's webhook" 
	stripe trigger payment_intent.succeeded --log-level debug
	echo "Sending PaymentFailed Event to Stripe's webhook" 
	stripe trigger payment_intent.payment_failed --log-level debug
# Full E2E test for stripe Payment Intents flow
.PHONY: test-stripe
	echo "To be implemented"