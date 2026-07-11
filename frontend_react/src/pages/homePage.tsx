// src/pages/homePage.tsx

import type { JSX } from "react/jsx-runtime";
import SimpleLink from "../components/common/simpleLink";

export default function HomePage(): JSX.Element {
  return (
    // Um container flexível para empurrar o conteúdo para o centro
    <div className="flex flex-col min-h-[calc(100vh-80px)]"> 
      {/* Nota: 80px é a altura (h-20) do seu header, para o cálculo dar exato */}

      {/* Botões Superiores */}
      {/* <div className="m-6 flex justify-end space-x-6">
        <SimpleLink to="/login" variant="navButton">
          Entrar
        </SimpleLink>
        <SimpleLink to="/cadastrar" variant="navButton">
          Cadastrar-se
        </SimpleLink>
      </div> */}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center">
        {/* A classe centralize do seu CSS já resolve os espaçamentos e alinhamentos! */}
        <section className="centralize">
          <h1 className="textBanner">
            Prepare-se para sua formação de forma inteligente
          </h1>
          <p className="textCard">
            Várias trilhas de cursos de tecnologia, redirecionamento para
            plataformas de cursos on-line grátis e muito mais.
          </p>
          <SimpleLink to="/cadastrar" variant="outline">
            Comece agora. Tudo de forma gratuita!
          </SimpleLink>
        </section>
      </main>
    </div>
  );
}