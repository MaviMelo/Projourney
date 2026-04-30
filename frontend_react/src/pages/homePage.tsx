// src/pages/homePage.tsx

import type { JSX } from "react/jsx-runtime";
import SimpleLink from "../components/common/simpleLink";

export default function HomePage(): JSX.Element {
  return (
    <div>
      <div className="m-6 flex justify-end space-x-6">
        <SimpleLink to="/login" variant="navButton">
          Entrar
        </SimpleLink>
        <SimpleLink to="/cadastrar" variant="navButton">
          cadastrar
        </SimpleLink>
      </div>

      {/* Hero Section */}
      <main>
        <section className="centralize">
          <h1 className="textBanner">
            Prepare-se para sua formação de forma inteligente
          </h1>
          <p className="textCard">
            Varias trilhas de cursos de tecnologia, redirecionamento para
            plataformas de cursos on-line grátis e muito mais.
          </p>
          <SimpleLink to="Login" variant="outline">
            Comece agora. Tudo de forma gratuita!
          </SimpleLink>
        </section>
      </main>
    </div>
  );
}
