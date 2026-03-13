'use client' 

import { useActionState } from 'react'
import { registerAction } from '@/app/actions/auth'

// The shape now perfectly matches the Server Action returns
const initialState = {
  error: '',
  success: false,
  user: null, 
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Create an Account</h1>
      
      <form action={formAction} className="flex flex-col space-y-4">
        
        <label>Email</label>
        <input type="email" name="email" required className="border p-2" />
        
        <label>Username</label>
        <input type="text" name="username" required className="border p-2" />
        
        <label>Password</label>
        <input type="password" name="password" required className="border p-2" />
        
        {state?.error && (
            <p className="text-red-500 text-sm">{state.error}</p>
        )}

        {state?.success && (
            <p className="text-green-500 text-sm">Account created successfully!</p>
        )}
        
        <button type="submit" disabled={isPending} className="bg-blue-500 text-white p-2 mt-4 rounded disabled:bg-blue-300">
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}