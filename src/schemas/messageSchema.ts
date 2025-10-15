import {z} from 'zod'

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, {error: 'message must be of 10 characters'})
        .max(300, {error: 'message must not be more than 300 characters'})

})