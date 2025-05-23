# Distributed Ticketing System

A robust, event-driven ticketing platform built using a modern microservices architecture. This project simulates a real-world ticket purchasing system, complete with user authentication, ticket management, order expiration, and secure payments — all managed via containerized, scalable services.

Developed by **Rommel Rodriguez Perez**.

---

## 🚀 Features

- ✅ Microservice architecture using Docker and Kubernetes
- ✅ Real-time communication with **NATS + JetStream** — integrated directly into the main app (no external NATS microservice)
- ✅ Scalable, independently deployable services
- ✅ Secure authentication and authorization using JWT
- ✅ Shared codebase via internal npm packages
- ✅ Resilient event-driven workflows and distributed state management
- ✅ Modern frontend built with Next.js and React

---

## 🧱 Microservices Overview

| Service       | Description                                              |
|---------------|----------------------------------------------------------|
| Auth          | User authentication, JWT token generation, login/logout |
| Tickets       | Ticket creation, updates, and querying                  |
| Orders        | Ticket reservation and order lifecycle                  |
| Payments      | Integration with payment processors and webhooks        |
| Expiration    | Publishes expiration events after a set timeout         |
| NATS Bus      | Built-in JetStream-powered event system (no separate container) |
| Client        | React + Next.js-based frontend for end users            |

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Next.js, Tailwind CSS
- **Communication**: NATS with JetStream
- **Data Stores**: MongoDB, Redis (optional for caching/events)
- **Containerization**: Docker, Kubernetes (Minikube or Docker Desktop)
- **Testing**: Jest, Supertest
- **DevOps (optional)**: Skaffold, GitHub Actions

---

## 📦 Local Development Setup

### Prerequisites

- Docker
- Kubernetes (Minikube recommended)
- Skaffold (for hot reload and continuous deployment)
- Node.js and NPM

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rommel-rodriguez/distributed-ticketing-system.git
   cd distributed-ticketing-system
   ```
   ```

2. **Start Minikube and enable ingress**
   ```bash
   minikube start
   minikube addons enable ingress
   ```

3. **Edit your local `/etc/hosts`**
   Add:
   ```
   127.0.0.1 ticketing.local
   ```

4. **Run the project with Skaffold**
   ```bash
   skaffold dev
   ```

---

## 🔐 Authentication

- All protected routes use JWT-based authentication
- Tokens are stored securely in HTTP-only cookies
- Shared middleware and validation logic implemented in `common/`

---

## 📁 Project Structure

```
distributed-ticketing-system/
├── client/         # Frontend (React + Next.js)
├── auth/           # Auth microservice
├── tickets/        # Ticket management service
├── orders/         # Order lifecycle management
├── payments/       # Secure payment processing
├── expiration/     # Order expiration events
├── nats-wrapper/   # Abstracted NATS JetStream integration
├── common/         # Shared utilities, middleware, types
```

---

## 🧪 Running Tests

Each microservice has its own test suite:
```bash
npm run test
```

Use mocks for external services and unit/integration testing for core logic.

---

## 🛠️ Notable Enhancements

- 🔄 Modern NATS with JetStream is **natively integrated into the main application**, improving performance and reducing system complexity
- 🧩 Modularized shared code and event definitions for maintainability
- 🔒 Built-in input validation, error handling, and role-based access control
- 🎨 Responsive and intuitive frontend using TailwindCSS and server-side rendering

---

## 📜 License

This project is licensed under the MIT License.

🔗 [MIT License](https://choosealicense.com/licenses/mit/)

---

## 🙌 Author

**Rommel Rodriguez Perez**  
Microservices Architect | Full-Stack Developer | Software Craftsman
