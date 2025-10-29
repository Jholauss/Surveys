// src/components/ui/LogoImage.tsx

'use client';

import { useState } from 'react';

export default function LogoImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? 'https://placehold.co/48x48/042254/white?text=PUCP' : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}