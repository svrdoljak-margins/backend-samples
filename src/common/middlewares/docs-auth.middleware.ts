import * as basicAuth from 'express-basic-auth';

export const docsAuthMiddleware = () =>
  basicAuth({
    challenge: true,
    users: {
      ['admin']: 'admin',
    },
  });
