import {email, z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, 'username atleast 2 character')
    .max(20, 'not more that 20 character')
    .regex(/^[a-zA-Z0-9_]+$/, 'username must not contain special character') 


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({error: 'invalid email address'}),
    password: z.string().min(6, {error: 'passoword must be atleast 6 character'}),
     
})  