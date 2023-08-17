import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    username: string({
      required_error: "userame is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
    confirmPassword: string({
      required_error: "password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Email is not valid"),
  })
});


export type createUserInput = Omit<TypeOf<typeof createUserSchema>, "body.confirmPassword">