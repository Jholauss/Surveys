
import './globals.css';
import type { Metadata } from 'next';

export const metadata = {
  title: 'Evaluación de Docentes - PUCP',
  description: 'Sistema de evaluación docente de la Pontificia Universidad Católica del Perú',
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