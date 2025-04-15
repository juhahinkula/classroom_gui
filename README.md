# GUI for Github Classroom 

To be fixed: 
- Organization is read from the `.env` file. Should be dynamically fetched.

## Getting Started

### Install dependencies
```bash
npm install
```
### Create Github token
Use fine-grained personal access token: [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token]

### Create .env file
Create `.env` file to the project root and add the following env variable using your own token:
```
VITE_GITHUB_TOKEN=[your_github_token]
VITE_OWNER_ORGANIZATION=[Organization login of your classrooms]
VITE_PATH_NAME=src/App.tsx
VITE_TS_MODE=false
```
Note! `VITE_TS_MODE` is a special setting for internal purposes. It allows to transpile TypeScript React component ot JavaScript and open it in browser (value=true).

### run the project
```
npm run dev
```