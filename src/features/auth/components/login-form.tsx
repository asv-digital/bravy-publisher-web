'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginFormData } from '../schemas/login-schema'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      router.push('/dashboard')
    } catch {
      toast.error('Credenciais invalidas')
    }
  }

  return (
    <div className="w-full max-w-[420px] px-4">
      <div className="relative rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-zinc-950/50">
        {/* Gradient border effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gradient-to-br ring-white/10" />

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="size-6" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Publisher
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Bravy Maestria
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className="pr-9"
                {...register('password')}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-2 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Footer link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>
    </div>
  )
}
