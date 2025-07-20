# General Coding Practices & Standards

## Test-Driven Development (TDD)
You must follow a Test-Driven Development approach. Before implementing a feature, you should first think of and generate the unit tests that will provide desired coverage to test that particular feature. Write the failing tests, then implement the code to make them pass.

## File Creation
When you are asked to create a new component or a service, you MUST also create its corresponding test file at the same time, in the appropriate test directory.

## JSDoc for Documentation
Every exported function or class method MUST have a JSDoc comment block explaining its purpose, parameters, and return value. Include @param tags for parameters, @returns for return values, and @throws for potential errors.

## Code Quality Standards

- If you can't find the appropriate repository required by the task, just conclude the task
- Follow language-specific best practices and type everything appropriately
- Maximum line length is 120 characters
- Maximum file length is 300 lines excluding comments and blank lines
- Keep functions and methods focused on a single responsibility
- Follow SOLID principles
- Handle errors gracefully with proper error handling
- Use async/await pattern for asynchronous operations
- Write meaningful variable and function names that describe their purpose

## File Organization

- One main component/class per file
- Keep related files close together
- Use consistent naming conventions across the project
- Organize imports logically: external libraries first, then internal modules
- Group related functionality into appropriate directories

## Error Handling

- Always handle potential errors in async operations
- Use try-catch blocks appropriately
- Provide meaningful error messages
- Log errors with sufficient context for debugging
- Return appropriate HTTP status codes for API endpoints

## Security Best Practices

- Validate all input data
- Sanitize user inputs to prevent injection attacks
- Use proper authentication and authorization
- Never expose sensitive information in logs or error messages
- Follow principle of least privilege

## Performance Considerations

- Avoid unnecessary database queries
- Use appropriate data structures for the task
- Consider caching for frequently accessed data
- Optimize loops and recursive functions
- Use pagination for large data sets

## Code Review Standards

- Code should be self-documenting with clear variable names
- Complex logic should have explanatory comments
- All public APIs should have comprehensive documentation
- Tests should cover edge cases and error scenarios
- Follow the established patterns in the existing codebase
