// src/app/admin/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (email === 'admin@pucp.edu.pe' && password === 'admin123') {
        // Crear la cookie de sesión con el path correcto
        document.cookie = 'admin_session=authenticated; path=/; max-age=86400; SameSite=Lax';
        
        // Pequeño delay para asegurar que la cookie se establezca
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirigir al dashboard
        router.push('/admin/surveys');
        router.refresh(); // Forzar actualización del middleware
      } else {
        setError('Credenciales inválidas');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al iniciar sesión. Intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#042254] mb-2">Inicie sesión</h2>
            <p className="text-gray-600">Ingrese sus credenciales de administrador</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pucp.edu.pe"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#042254] hover:bg-[#042254]/90"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}