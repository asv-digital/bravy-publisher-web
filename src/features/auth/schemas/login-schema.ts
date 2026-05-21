import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z
    .email('Formato de e-mail invalido')
    .min(1, 'E-mail e obrigatorio'),
  password: z
    .string()
    .min(6, 'A senha deve ter no minimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
