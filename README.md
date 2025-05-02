[![Node.js CI](https://github.com/juhahinkula/classroom_gui/actions/workflows/node.js.yml/badge.svg)](https://github.com/juhahinkula/classroom_gui/actions/workflows/node.js.yml)

# GUI for Github Classroom 

GUI for teachers to display classrooms, assignments, and student submissions. 

## Getting Started

### Install dependencies
```bash
npm install
```
### Create Github token
If your classroom uses private repositories, generate a classic personal GitHub token. When setting the scopes, choose *Full control of private repositories*. For detailed steps, see the instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).

Otherwise, you can Use fine-grained personal access token. See the instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

### Create .env file
Create `.env` file to the project root and add the following env variables:
```
VITE_GITHUB_TOKEN=[your_github_token]
VITE_OWNER_ORGANIZATION=[Organization login of your classrooms]
VITE_PATH_NAME=src/App.tsx
VITE_TS_MODE=false
```
- `VITE_TS_MODE` is an internal configuration used for development purposes. When set to `true`, it enables the transpilation of TypeScript React components into JavaScript, allowing them to be opened directly in the browser.
- `VITE_PATH_NAME` defines the default file to be opened in the code editor. This can be left empty, allowing you to manually select a file from the file tree instead.

### run the project
```bash
npm run dev
```
