/* eslint-disable @typescript-eslint/explicit-function-return-type */

import auth from 'express-basic-auth';
/**
 * Creates HTTP basic-auth middleware protecting the Swagger docs route.
 * @param username - Allowed username.
 * @param password - Allowed password.
 * @returns Configured express-basic-auth middleware.
 */
export const createDocsAuthMiddleware = (username: string, password: string) =>
  auth({
    challenge: true,
    users: { [username]: password },
  });
