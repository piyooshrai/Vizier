---
description: Create a new React component
---

1. Create a new component file at `src/components/<category>/<ComponentName>.tsx`

2. Use this template:
```tsx
import React from 'react';

interface <ComponentName>Props {
  // Define props here
}

export const <ComponentName>: React.FC<<ComponentName>Props> = (props) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

3. Export the component from `src/components/<category>/index.ts` if an index file exists.

4. Key conventions:
   - Use PascalCase for component names
   - Define TypeScript interfaces for props
   - Use functional components with React.FC
   - Components go in appropriate category folders (e.g., `common/`, `layout/`, `forms/`)
