export const ENV = {
  APP_NAME: process.env.APP_NAME,
  APP_VERSION: process.env.APP_VERSION,
  APP_DESCRIPTION: process.env.APP_DESCRIPTION,
  NODE_ENV: process.env.NODE_ENV,
  APP_SHORT_NAME: process.env.APP_SHORT_NAME,
  APP_HOMEPAGE: process.env.APP_HOMEPAGE,
  APP_REPOSITORY: process.env.APP_REPOSITORY,
  AUTHOR: process.env.AUTHOR,
  PROJECT_NAME: process.env.PROJECT_NAME,
  BUILD_DATE: process.env.BUILD_DATE
} as const; // Set as Readonly
