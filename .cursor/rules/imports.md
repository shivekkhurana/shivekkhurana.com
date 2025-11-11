# Import Rules

- **Always use absolute imports only** - Never use relative imports (e.g., `../` or `./`)
- Use the `@src/*` path alias for all source files (e.g., `@src/config`, `@src/domain/location.types`)
- Use `@contentlayer/generated` for contentlayer generated types
- When creating new files, ensure all imports use absolute paths

## Examples

✅ Correct:

```typescript
import config from '@src/config';
import type { LocationData } from '@src/domain/location.types';
import { allPosts } from '@contentlayer/generated';
```

❌ Incorrect:

```typescript
import config from '../config';
import type { LocationData } from './location.types';
```
