# Frontend Rules (Next.js) with Examples

## Component Design: Functional Components
All new React components MUST be functional components using Hooks. Create components that are focused on a single responsibility and use proper TypeScript interfaces for props.

## TypeScript Integration
Use TypeScript for all new components and utilities with proper type definitions. Define interfaces for component props, state objects, and API responses. Use generic types where appropriate and ensure strict type checking.

## State Management: Context API
Use React Context for global state management with proper TypeScript typing. Create context providers for different domains (auth, expenses, etc.). Use useReducer for complex state logic and provide proper action types.

## Custom Hooks
Create reusable custom hooks for common functionality like API calls, form handling, and local storage management. Custom hooks should encapsulate logic and provide clean interfaces for components to use.

## Form Handling with Validation
Use controlled components with proper validation using Zod schemas. Implement real-time validation feedback and proper error handling. Clear validation errors when users start correcting their input.

## Next.js API Routes
Structure API routes with proper error handling and validation. Use Zod for request body validation. Implement consistent response formats across all endpoints. Handle authentication and authorization properly.

## Styling with Tailwind CSS
Use Tailwind CSS for consistent styling with component-based approach. Create reusable UI components with proper variant support. Use responsive design principles and maintain consistent spacing and colors.

## Testing with Jest and React Testing Library
Write comprehensive tests for components and hooks. Test user interactions, state changes, and error scenarios. Use proper mocking for external dependencies and API calls.

## File Organization Standards
- Components in `src/components/` with subfolders for organization
- Pages in `src/app/` following Next.js 13+ app router structure
- Custom hooks in `src/hooks/`
- Context providers in `src/context/`
- Utilities in `src/utils/`
- Types in `src/types/` or co-located with components
- API routes in `src/app/api/`

## Performance Optimization
- Use React.memo for expensive components
- Implement proper loading states
- Use Next.js Image component for optimized images
- Implement proper error boundaries
- Use dynamic imports for code splitting when appropriate

## Component Props and State
- Always define TypeScript interfaces for component props
- Use optional props with default values where appropriate
- Implement proper prop validation and error handling
- Keep component state minimal and focused

## API Integration
- Use consistent error handling across all API calls
- Implement proper loading states for async operations
- Handle network errors and provide user feedback
- Use proper HTTP status codes and response formats

## Accessibility
- Include proper ARIA attributes for interactive elements
- Ensure keyboard navigation works correctly
- Provide proper focus management
- Use semantic HTML elements where possible
