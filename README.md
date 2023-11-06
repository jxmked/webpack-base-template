# webpack-base-template

My personal Webpack config.

### Commands

#### `npm start` | `npm run dev`

**Start development mode.**

Some plugin would not work in development mode to fasten
the compiler.

#### `npm run build`

**Start production build**

Run and execute all plugins.

> Note: Satisfy the compiler first before starting to build mode.
> It would not successfully compile your lifes work if there is a mistake or an error.

#### `npm run prettier-format`

**Prettify your code in `src` folder**

#### `npm run prettier-format:md`

**Prettify your files from base folder**

#### `npm run eslint` | `npm run eslint:fix`

**Linter your TypeScript code**

Execute linter to check for other problem from your TypeScript code.
Add `:fix` at the end of the command to fix some issue that are fixable

#### `npm run stylelint` | `npm run stylelint:fix`

**Linter your stylesheet code**

Similar to `npm run eslint` but for stylesheet

### Configurations

- Open `webpack.config.mjs` and search for `// REPLACE` to see all parameters that you might need to change per project.
- Replace icon from `src/assets/icon.png` with your app icon.
- Place your `favicon.ico` icon into `public` folder
- MAKE SURE TO REPLACE GOOGLE MEASUREMENT ID OR REMOVE THE PLUGIN IF YOU DON'T HAVE IT
- All files from `public` folder will be minified (if possible) and copied to dist folder.
- Update your `package.json` file.
- Use atleast 1024x1024px icon for your `icon.png`
- Use 16x16px icon for your `favicon.ico`

### Interpolating `index.html`

Automatically update your HTML contents by using this keys

|       Key        |                Description                |
| :--------------: | :---------------------------------------: |
|     %TITLE%      |    Your project name from package.json    |
|  %APP_VERSION%   |     Project version from package.json     |
|    %APP_MODE%    |        Project mode. (development | production) |
|    %BASE_URL%    |    Project homepage from package.json     |
|  %CURRENT_YEAR%  |     Year when project has been build      |
|  %CURRENT_DATE%  |     Date when project has been build      |
| %APP_REPOSITORY% | Project repository link from package.json |

### Notes

- Modify project dependencies only if needed
- PLACE YOUR OWN GOOGLE MEASUREMENT ID or REMOVE THE PLUGIN

### Features

- Automatically produce `site.webmanifest` base on your inputs
- Automatically resize your icon from `src/assets/icon.png` into different sizes it needs
- Automatically update every code changes. Restart required when modifying webpack config
- Uses Typescript, Sass for yoyr project
- Automatically inject Google Tag Manager in build mode
- Automatically insert Open Graph, Twitter and some meta data that helps other platform such as Facebook, Google and Twitter
- Just try to use it see other features. I am not sure what I have done with it.
