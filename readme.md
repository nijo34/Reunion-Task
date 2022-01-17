# Reunion-Task

This is my submission for Backend Assignment - REUNION. I have used postgres along with the Prisma ORM.

## Features

- Basic Authentication (Register/Login with hashed password)
- JWT Tokens, make requests with a token after login with Authorization header with value Bearer yourToken where yourToken will be returned in Login response.
- Pre-defined response structures with proper status codes.
- Included CORS.
- Validations added.
- Included API collection for Postman.

## Software Requirements
- Node.js 8+
- Prisma
- PostgreSQL

## Installation

### Using Git(recommended)
1. Clone the project from github. Change "myproject" to your project name.
```bash
git clone https://github.com/nijo34/Reunion-Task.git ./myproject
```
### Using manual download ZIP
1. Download repository
2. Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
npm install myproject
```

## Setting up environments
1. You will find a file named .env.example on root directory of project.
2. Create a new file by copying and pasting the file contents and then rename it to ```dev.env``` 
```
cp .env.example dev.env
```
3. Move the  dev.env file from the root of the directory to the config folder.
4. The file ```dev.env``` is already ignored, so you never commit your credentials.
5. Change the values of the file to your environment. Helpful comments added to ```.env.example``` file to understand the constants.

- #### Run the API server locally
```bash
npm run dev
```
You will know server is running by checking the output of the command npm run dev
```
Server is up on port YOUR_PORT_NUMBER
```

**NOTE:**
YOUR_PORT_NUMBER will be the port number that you specify

## Documentation
Refer
[Docs](https://documenter.getpostman.com/view/10946683/UVXkma4P) for more details.