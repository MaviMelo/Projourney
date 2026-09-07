import { useState, useEffect } from 'react';

// ÍCONE ORIGINAL DE ACESSIBILIDADE
function AccessibilityIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="5.5" r="2" />
      <path d="M5 11c3-1.5 5.5-2 7-2s4 .5 7 2" />
      <path d="M12 9v6" />
      <path d="m9 21 2.5-6h1l2.5 6" />
      <path d="M19.5 7.5a9 9 0 0 1 0 9" strokeWidth="1.5" strokeDasharray="1 3" />
      <path d="M4.5 7.5a9 9 0 0 0 0 9" strokeWidth="1.5" strokeDasharray="1 3" />
    </svg>
  );
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [boldText, setBoldText] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false); // NOVO ESTADO

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (boldText) {
      document.body.classList.add('bold-text');
    } else {
      document.body.classList.remove('bold-text');
    }
  }, [boldText]);

  // EFEITO DO TEXTO GRANDE (Adicionado na tag HTML para escalar o Tailwind inteiro)
  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[9999] flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Abrir menu de acessibilidade"
        title="Opções de Acessibilidade"
      >
        <AccessibilityIcon className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[9999] w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5 transform transition-all animate-in slide-in-from-bottom-5">
          
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-white text-lg font-bold flex items-center gap-2">
              Acessibilidade
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Fechar menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            
            {/* Alto Contraste */}
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                highContrast 
                  ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-500' 
                  : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
              }`}
            >
              Alto Contraste
              <span className={`w-3 h-3 rounded-full ${highContrast ? 'bg-black' : 'bg-gray-500'}`}></span>
            </button>

            {/* Texto Mais Grosso */}
            <button 
              onClick={() => setBoldText(!boldText)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                boldText 
                  ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
              }`}
            >
              Texto Mais Grosso
              <span className={`w-3 h-3 rounded-full ${boldText ? 'bg-white' : 'bg-gray-500'}`}></span>
            </button>

            {/* NOVO: Ampliar Visão */}
            <button 
              onClick={() => setLargeText(!largeText)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                largeText 
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                  : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
              }`}
            >
              Ampliar Texto
              <span className={`w-3 h-3 rounded-full ${largeText ? 'bg-white' : 'bg-gray-500'}`}></span>
            </button>
            
            <p className="text-gray-400 text-xs text-center mt-2">
              O tradutor de Libras está localizado no canto direito da tela.
            </p>
          </div>
        </div>
      )}
    </>
  );
}