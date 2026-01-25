import { auth } from "express-oauth2-jwt-bearer";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config";

export const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: `https://${AUTH0_DOMAIN}`,
});
