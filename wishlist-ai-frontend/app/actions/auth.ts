'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Register Function
export async function registerAction(prevState: any, formData: FormData) {
  // Extract raw data from HTML form inputs
  const email = formData.get('email');
  const username = formData.get('username');
  const password = formData.get('password');

  // Send the HTTP POST request to FastAPI backend
  try {
    const response = await fetch('http://127.0.0.1:8000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    // Parse the JSON response from FastAPI
    const data = await response.json();

    // Handle FastAPI's HTTP 400 errors
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to register');
    }

    // Return success back to the Next.js UI
    return { error: '', success: true, user: data };
  } catch (error) {
    // Handle cases where FastAPI server is turned off.
    return { error: 'Internal Server Error: Is the backend running?', success: false, user: null };
  }
}


// Login Function
export async function loginAction(prevState: any, formData: FormData) {
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