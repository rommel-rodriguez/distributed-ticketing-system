# Partial test for Stripe Payment Intents flow: Just testing the Webhook
.PHONY: test-webhook
test-webhook:
	echo "Sending PaymentSucceeded Event to Stripe's webhook" 
	stripe trigger payment_intent.succeeded --log-level debug
	echo "Sending PaymentFailed Event to Stripe's webhook" 
	stripe trigger payment_intent.payment_failed --log-level debug
# Full E2E test for stripe Payment Intents flow
.PHONY: test-stripe
test-stripe:
	echo "To be implemented"
# 	NOTE: Need a valid orderId for the next one, try to automate this with Postman:
#	curl -X POST http://localhost:3000/api/payments \
	-H 'Content-Type: application/json' \
	-d '{"cart":[{"orderId":}]}'
# success path
#	stripe payment_intents confirm <pi_id> -d payment_method=pm_card_visa

# generic decline
#	stripe payment_intents confirm <pi_id> -d payment_method=pm_card_chargeDeclined

# requires SCA (stops at requires_action)
#	stripe payment_intents confirm <pi_id> -d payment_method=pm_card_threeDSecure2Required
