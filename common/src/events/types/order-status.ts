export enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved
  Created = 'create',

  // NOTE: For reference, too types of status are being
  // represented with the 'cancelled' status. In a real
  // context, it would most likely be better to split this
  // into 3 different statuses.
  // The ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order
  // Or, the order  expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The order has reserved the ticket and the user has
  // provided payment successfully
  Complete = 'complete',
}
