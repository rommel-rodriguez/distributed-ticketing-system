// NOTE: As subjects are bound to particular streams, for a production-grade application
// it might be necessary to model Subjects and Streams as full classes, or at least
// Subjects, as they would each need to be bound a to a single stream.
export enum Streams {
  EventStream = 'event-stream',
}
// NOTE: Token comment
