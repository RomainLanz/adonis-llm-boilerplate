# Use command models and read model projections

Domain entities and aggregates are used primarily on command paths where business invariants must be protected. Read paths may return explicit projections shaped for their use case instead of hydrating domain entities, keeping reads efficient without weakening command-side rules.
