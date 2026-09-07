import { useEffect } from 'react';

declare global {
  interface Window {
    VLibras: any;
  }
}

export default function VLibrasComponent() {
  useEffect(() => {
    const scriptId = 'vlibras-script';

    // Previne que o React StrictMode injete e remova o script rapidamente, o que quebra o widget
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        if (window.VLibras) {
          // Inicializa o widget
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    // A estrutura HTML precisa ser exatamente essa para o script do governo reconhecer
    // @ts-ignore
    <div vw="true" className="enabled">
      {/* ATENÇÃO: A classe do botão precisa ser "active" e não "enabled" */}
      {/* @ts-ignore */}
      <div vw-access-button="true" className="active" />
      {/* @ts-ignore */}
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}