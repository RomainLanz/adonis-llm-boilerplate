# Use Result for expected business outcomes

Actions return the local `Result` type when callers can reasonably react to a business refusal, with discriminated error variants that contain no HTTP concerns. Unexpected infrastructure failures, invalid persisted state, and impossible states continue to throw so delivery adapters can distinguish application outcomes from broken execution.
