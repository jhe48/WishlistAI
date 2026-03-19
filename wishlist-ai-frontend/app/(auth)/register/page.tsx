'use client' 

import { useActionState, useState, useEffect } from 'react'
import Link from 'next/link';
import { registerAction } from '@/app/actions/auth'
import { useTheme } from 'next-themes';

// The shape now perfectly matches the Server Action returns
const initialState = {
  error: '',
  success: false,
  user: null, 
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 bg-[#fafafa] dark:bg-[#121212] text-zinc-900 dark:text-zinc-200">
      {mounted && (
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-all duration-300"
          >
            <span className="w-2 h-2 rounded-full border border-current group-hover:bg-current transition-colors duration-300"></span>
            {theme === 'dark' ? 'Unwrap' : 'Wrap'}
          </button>
        </div>
      )}

      <div className="w-full max-w-sm p-8">
        <h1 className="text-5xl mb-12 text-center tracking-wide font-[family-name:var(--font-franchise)]">
          WishlistAI awaits. Join us.
        </h1>

        <form action={formAction} className="flex flex-col gap-6">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full py-2 bg-transparent border-b border-gray-400 focus:border-current outline-none transition-colors placeholder-gray-400"
            required
          />
          
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full py-2 bg-transparent border-b border-gray-400 focus:border-current outline-none transition-colors placeholder-gray-400"
            required
          />
          
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full py-2 bg-transparent border-b border-gray-400 focus:border-current outline-none transition-colors placeholder-gray-400"
            required
          />

          {state?.error && (
            <div className="text-red-500 text-sm text-center">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="text-green-500 text-sm text-center">
              Account created successfully!
            </div>
          )}
          
          <button
            type="submit"
            disabled={isPending}
            className="mt-6 py-3 rounded font-medium tracking-wide transition-colors disabled:opacity-50 bg-zinc-900 dark:bg-zinc-200 text-[#fafafa] dark:text-[#121212] hover:bg-zinc-800 dark:hover:bg-white"
          >
            {isPending ? 'Creating...' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-16 text-center text-sm opacity-60 hover:opacity-100 transition-opacity">
          <Link href="/login">
            Already registered? Log in.
          </Link>
        </div>
      </div>
    </div>
  )
}