// src/app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminHome() {
  // Fallback por si el middleware no redirige
  redirect('/admin/surveys');
}