import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-[#0C0D0D] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-accent-purple" />
        <p className="text-gray-400">Cargando...</p>
      </div>
    </div>
  );
};

export default PageLoader;

