This application is a modular AdonisJS monolith.

Read `../../docs/architecture/application.md` before changing controllers, Actions, Queries, repositories, domain objects, jobs, or capability boundaries. Controllers expose at most `render` for Inertia pages and `execute` for mutations or endpoints; register either method explicitly in its route. Group them by use case, not by URL: a composite page has one `render` controller and focused `execute` controllers for its independent mutations. Keep imports flowing from `app` into `src`.
