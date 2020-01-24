# minidotenv

Simple function that loads and parses `.env` file(s). `env` file is a text file where you specify environment variables that you want to use somewhere in your code.

You can attach the environment variables to Node's `process.env` object if specified. Do this at the beginning of your app.

This library has no runtime dependencies and provides Typescript definitions.

## Usage

By default the function will attempt to load `.env` file from the location where code is being executed.

Example usage:

```javascript
// .env
PORT=3000

// ./env.js
import minidotenv from 'minidotenv'

// Loads .env automatically from current folder
const config = minidotenv()

export default config


// ./app.js
import express from 'express'
import config from './env'

const app = express()
// [...]
app.listen(config('PORT'))
```

Specify custom location for `env` file:

```javascript
import minidotenv from 'minidotenv'

const config = minidotenv({
  path: path.join(__dirname, 'config', '.env')
})

export default config
```

Automatically load all variables into Node `process.env` object:

```javascript
// ./.env
FOO=BAR

// ./app.js
import minidotenv from 'minidotenv'

const config = minidotenv({ inject: true })
console.log(process.env.FOO) // BAR
```

## FAQ

**Q: Why should I use `env` file?**

A: It's useful to configure your app via environment variables. You can put them at one place so the values don't have to be hard-coded and you can actually change them for different kinds of build.
Lot of cloud providers enable to set environment variables in some way so you can have variables for production and local development. **WARNING! Do not commit env file into version control** as it might contain sensitive information (such as password for database etc).

**Q: Do I have to call `minidotenv()` in every place where I need to retrieve the value?**

A: No and actually it's not recommended. Everytime you call the function, the file is loaded from the disk. You should reference the function in your code via variable. Another solution is to call `minidotenv()` in separate file and then export the returned function. You can then use it anywhere. For complex projects, consider using Dependency injection so you always have the same function everywhere.

**Q: This sucks! It does not work in the browser! Why?**

A: Browsers do not have the concept of Node's `process` object so this will not work. This library will not overcome this obstacle.
You should pass the environment variables during build time as global variables which you can then reference later in your code. [Webpack](https://webpack.js.org/plugins/define-plugin/) supports this.

**Q: Can I use this library to load environment variables when calling npm script in `package.json`?**

A: No. Look at `dotenv` and `dotenv-cli` libraries.

**Q: If I use 'inject' option, the numeric values from the env file are retrieved from 'process.env' object as strings. Why?**

A: That is how the Node runtime works. Anything that is set to `process.env` object is converted to string eventually.

## API

Package exposes single function as default. This function creates a closure where the contents of parsed `env` file are held. You can pass options to the function to customize behaviour (see below).

`(options: {
  inject?: boolean,
  path?: string,
  env?: NodeJS.ProcessEnv,
}) => (key: string) => string | number | undefined`

This function returns another function which retrieves the values by key:

`(key: string) => string | number | undefined`

*Options*

- `inject: boolean`: Injects the variables into `process.env` object by default or optionally to object passed via `env` option.
- `path`: Path to your env file. By default it loads file called `.env` in the location of execution (ususally root of the project).
- `env`: If you need to override `process.env` object when `inject` options is set to true. It should be Javascript object.

## `env` file

This file is a simple text file. Name it `.env` and place it at the root of your project. Key and value is separated by `=`. Place each pair on new line. You can have values like this in it:

```
FOO=BAR
HELLO="WORLD"
SENTENCE="is made of words"
PORT=3000
SIZE=1.23
# Comment
VERSION="1.2.3"
```

The values are coerced into strings if the value is not a number (integer or float). The parsing is very simple.

## Development

The project uses Typescript. There are several NPM scripts:

- `build`: Builds the library into regular CommonJS module with bundled Typescript definitions (and source map).
- `test`: Run unit tests.
