# Cline Rules for Next.js Project

## Project Structure

- This is a Next.js application written in TypeScript
- Uses component-based architecture with business, UI, and HR components
- Implements CSS modules for styling (files in src/styles/)
- Follows hook-based patterns for state management
- Uses context for global state
- Organized into logical directories: components, hooks, context, service, utils

## Code Style

- If you cant find the appropriate repository required by the task, just conclude the task.
- Follow TypeScript best practices and type everything appropriately
- Maximum line length is 120 characters
- Maximum file length is 300 lines excluding comments and blank lines
- Use single quotes for JSX attributes and strings
- Use double quotes for HTML attributes and in CSS
- Component props should be properly typed with interfaces
- Follow React functional component patterns with proper typing:

  ```tsx
  type ComponentProps = {
    prop1: string;
    prop2?: number;
  };

  const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
    // implementation
  };
  ```

## File Organization

- One component per file
- Component file names should be PascalCase
- Utility/hook file names should be camelCase
- CSS module files should match component names
- Keep related files close together
- Use named exports for utilities and hooks
- Use default exports for components

## Path Imports

- Use the @/ alias for src/ directory imports
- Example: `import Component from "@/components/Component"`
- Import order: React, Next.js, external libraries, internal components, styles

## Component Guidelines

- Use functional components with hooks
- Create small, reusable components
- Separate business logic from UI components
- Use proper React hook patterns (useState, useEffect, custom hooks)
- Always include accessibility attributes (aria-\*)
- Handle loading and error states appropriately

## Styling

- Use CSS modules for component styling
- Keep styles close to components
- Follow responsive design principles
- Use Tailwind CSS classes when appropriate

## Images & Assets

- Store SVG images in public/images/svg/ directory
- Use the centralized images utility (src/utils/images.ts) for accessing images
- Reference images via the import: `import images from "@/utils/images"`
- Follow the established pattern for adding new images:

  ```ts
  // Define the path at the top of the file
  const newIcon = `${imagePath}svg/new-icon.svg`;

  // Add to the images object
  const images = {
    // existing properties
    newIcon,
    // or add to nested category
    category: {
      // existing category properties
      newIcon,
    },
  };
  ```

- Organize images into logical groups (login, documents, feedback, etc.)
- Use SVG format for icons and UI elements when possible

## Code Quality

- Follow SOLID principles
- Write unit tests for components and utilities
- Avoid prop drilling, use context or custom hooks
- Handle errors gracefully
- Use async/await pattern for asynchronous operations
- Keep components and functions focused on a single responsibility
- Use TypeScript to prevent runtime errors
- Make sure to not have any active and fixable problems in the problems tab