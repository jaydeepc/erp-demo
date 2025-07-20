# Backend Rules (Node.js) with Examples

## Architecture: Repository Pattern
You MUST use the repository pattern for all database interactions to separate data access from business logic. Create repository classes that handle all database operations for specific entities. Each repository should have methods like findById, create, update, delete, and any custom query methods needed.

## Data Validation: Input Validation with Zod
You MUST validate the structure and types of all incoming API request bodies using the zod library to ensure data integrity. Create validation schemas for create and update operations. Include proper error messages and validation rules like minimum lengths, positive numbers, required fields, and enum values.

## Controller Pattern
Controllers should be thin and delegate business logic to services. Always validate input using Zod schemas and handle errors properly. Controllers should only handle HTTP-specific concerns like request/response formatting, status codes, and calling the appropriate service methods.

## Service Layer
Business logic should be encapsulated in service classes that use repositories for data access. Services should handle complex business rules, validation beyond basic input validation, and coordinate between multiple repositories when needed. Each service should focus on a specific domain area.

## Error Handling Middleware
Implement centralized error handling with proper HTTP status codes. Create middleware that catches all errors and formats them consistently. Handle specific error types like Mongoose validation errors, cast errors, and duplicate key errors with appropriate status codes and messages.

## Database Models (Mongoose)
Use proper schema definitions with validation and middleware. Define schemas with appropriate field types, validation rules, required fields, and default values. Add indexes for better query performance. Use schema middleware for pre/post hooks when needed.

## Testing Standards
Write comprehensive tests for all layers using Jest. Test repositories, services, controllers, and routes separately. Use mocking for dependencies. Follow the Arrange-Act-Assert pattern. Test both success and error scenarios. Ensure good test coverage for edge cases.

## Environment Configuration
Use environment variables for configuration with proper defaults. Create configuration files that read from environment variables. Provide sensible defaults for development. Never hardcode sensitive information like database URLs or API keys.

## API Response Standards
Maintain consistent API response format across all endpoints. Use a standard format with success/error flags, data payload, and error messages. For paginated responses, include pagination metadata. Always return appropriate HTTP status codes.

## File Structure
- Place repositories in `backend/repositories/`
- Place services in `backend/services/`
- Place controllers in `backend/controllers/`
- Place validators in `backend/validators/`
- Place middleware in `backend/middleware/`
- Place models in `backend/models/`
- Place tests in `backend/tests/` with same folder structure
