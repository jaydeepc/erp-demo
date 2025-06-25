# Development Workflow

## Mandatory Steps

1. **Analyze Code and Requirements**

   - Parse the ticket description to understand what changes or additions are required in the codebase. If there is no relevant repository/code present, conclude the task.

2. **Create a New Branch / Pull if already exists**

   - Establish a new branch using the naming convention:  
     `feature|bug|hotfix_JiraTicket_ID`  
     _Example:_ `feature_AP-1234`
   - Check whether this new branch exists on github, if exits then checkout to that and start working, else create new branch.

3. **Implement Changes**

   - Make the necessary changes to the code based on the detailed analysis of the ticket.
   - Keep linting while making code checking, linting at last brings too many error logs
   - Follow the code-practices.md to code better

4. **Linting (checkstyles/eslint)**

   - Run the appropriate linting command 
      _Example:_ `npm run lint:fix / mvn -q clean install`
   - Understand and perform necessary linting fixes.

4. **Commit Your Changes**

   - Follow the commit message format:  
     `JiraTicket_ID: Brief commit message`  
     _Example:_ `AP-1234: Updated authentication logic`

5. **Push the Branch**

   - Push your committed changes to the remote repository. Always push the code before concluding the task.

Note: DO NOT SKIP ABOVE STEPS  
Note: Always checkout to the branch first if it exists rather than creating new one.
Note: While using java always use commands with least terminal output _Example:_ `mvn -q clean install`  
