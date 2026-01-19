---
description: Create a new page in the application
---

1. Create a new page file at `src/pages/<PageName>.tsx`

2. Use this template:
```tsx
import React from 'react';

const <PageName>: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"><Page Title></h1>
      {/* Page content */}
    </div>
  );
};

export default <PageName>;
```

3. Export the page from `src/pages/index.ts`:
```tsx
export { default as <PageName> } from './<PageName>';
```

4. Add the route in `src/App.tsx` under the appropriate section:
   - For protected pages, add inside the `<ProtectedRoute>` wrapper
   - For public pages, add with `<PublicRoute>` wrapper

5. If adding navigation, update the sidebar in `src/components/layout/Sidebar.tsx`
