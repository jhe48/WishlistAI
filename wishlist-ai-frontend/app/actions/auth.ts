'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  // 1. Next.js securely calls your FastAPI backend
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Invalid credentials')
  }

  const data = await response.json() // Contains the JWT from FastAPI

  // 2. Next.js sets the HTTP-Only cookie on the user's browser
  const cookieStore = await cookies()
  cookieStore.set('access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS)
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  // 3. Redirect to the authenticated home page
  redirect('/home')
}