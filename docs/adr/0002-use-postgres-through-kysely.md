# Use Postgres through Kysely

Postgres is the only supported database and Kysely is the persistence interface. The explicit SQL-shaped model, generated database types, and TypeScript migrations are preferred over Lucid's active-record model because business behavior belongs in capability modules and persistence mapping stays visible in repositories.
