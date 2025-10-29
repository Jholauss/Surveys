
import './globals.css';
import type { Metadata } from 'next';

export const metadata = {
  title: 'Sistema de Encuestas Dinámicas',
  description: 'Plataforma para crear y gestionar encuestas personalizadas con preguntas dinámicas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}