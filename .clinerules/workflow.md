# Development Workflow & Process Rules

<MUST FOLLOW EVERY TIME>
At the beginning of any new session or before starting a new task, you MUST first look at the `PROJECT_PLAN.md` file in the root directory. This file contains the status of all tasks and may include important pointers or feedback from the developer for your reference. Acknowledge that you have read it and understand the next task.
</MUST FOLLOW EVERY TIME>

## Git Collaboration
Make sure you create regular commits by asking the user at the logical end of a task. Use your intelligence to decide what a sensible, logical state is to commit the project. You don't want to end up with too many small commits, but you also want to save progress frequently.

*Example prompt to the user:*
"I have now completed the authentication foundation. This seems like a logical point to save our progress. Shall I ask the developer to commit these changes?"

## Mandatory Development Steps

1. **Analyze Code and Requirements**
   - Parse the ticket description to understand what changes or additions are required in the codebase
   - If there is no relevant repository/code present, conclude the task
   - Check both backend/ and frontend/ directories for relevant code

2. **Create a New Branch / Pull if already exists**
   - Establish a new branch using the naming convention:  
     `feature|bug|hotfix_description`  
     _Example:_ `feature_expense-approval-workflow`
   - Check whether this new branch exists on github, if it exists then checkout to that and start working, else create new branch

3. **Plan Before Coding**
   Before generating the full code for a file, first outline the implementation plan as comments at the top of the file. This should include the main components, functions, and logic steps.

4. **Implement Changes**
   - Make the necessary changes to the code based on the detailed analysis of the ticket
   - Keep linting while making code checking, linting at last brings too many error logs
   - Follow the code-practices.md, backend-nodejs.md, and frontend-nextjs.md rules

5. **Linting (checkstyles/eslint)**
   - For backend: Run `npm run lint` or `npm run lint:fix`
   - For frontend: Run `npm run lint` or `npm run lint:fix`
   - Understand and perform necessary linting fixes

6. **Testing**
   - Run existing tests to ensure no regressions
   - Backend: `npm test` in backend/ directory
   - Frontend: `npm test` in frontend/ directory

7. **Commit Your Changes**
   - Follow the commit message format:  
     `Brief descriptive commit message`  
     _Example:_ `Add expense approval workflow functionality`

8. **Push the Branch**
   - Push your committed changes to the remote repository
   - Always push the code before concluding the task

## Notes
- DO NOT SKIP ABOVE STEPS  
- Always checkout to the branch first if it exists rather than creating new one
- For Node.js projects, use commands with minimal terminal output when possible
- Consider both backend and frontend implications when making changes
