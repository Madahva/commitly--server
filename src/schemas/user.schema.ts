import { z } from "zod";

const pictureUrlSchema = z.url({
  protocol: /^https?$/,
  hostname: /^(s\.gravatar\.com|cdn\.auth0\.com|lh3\.googleusercontent\.com)$/,
});

export const userSchema = z
  .object({
    nickname: z.string().min(1),
    name: z.string(),
    picture: pictureUrlSchema,
    updated_at: z.iso.datetime(),
    email: z.email(),
    email_verified: z.boolean(),
    sub: z.string().regex(/^auth0\|[a-zA-Z0-9]+$/),
  })
  .strict();

export const createUserEndpointSchema = z.object({
  body: userSchema,
});

export type User = z.infer<typeof userSchema>;
