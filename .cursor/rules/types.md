# Type Definitions Rules

- **Always define types in corresponding `.types.ts` files** - Never define types inline in implementation files
- Each domain module should have a corresponding `*.types.ts` file (e.g., `location.ts` → `location.types.ts`)
- All type definitions should be exported from the types file
- Import types using absolute imports with the `@src/*` path alias

## Examples

✅ Correct:

```typescript
// location.types.ts
export type LocationEntry = {
  date: string;
  city: string;
  country: string;
};

export type CityData = {
  city: string;
  timezone: string;
  // ...
};

// location.ts
import type { LocationEntry, CityData } from '@src/domain/location.types';
```

❌ Incorrect:

```typescript
// location.ts
type LocationEntry = {
  date: string;
  city: string;
  country: string;
};

type CityData = {
  city: string;
  timezone: string;
};
```

## File Naming Convention

- Implementation file: `domain-name.ts`
- Types file: `domain-name.types.ts`
- Both files should be in the same directory
