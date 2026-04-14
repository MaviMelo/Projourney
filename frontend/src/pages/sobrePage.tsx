import React from 'react';
import SimpleLink from "../components/common/simpleLink";
import ParticleBackground from '../components/effects/particlebackground';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  return (
    <>
      <header className="sticky top-0 bg-blue-900/40 backdrop-blur-md border-b border-blue-500/30 px-10 py-4">
        <div className="flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-white">Sobre</h1>

          <nav className="flex items-center space-x-6">
            <SimpleLink
              to={localStorage.getItem('usuarioLogado') ? "/perfil" : "/"}
              variant="nav"
            >
              início
            </SimpleLink>
          </nav>
        </div>
      </header>

      <main className="p-8">
        <ParticleBackground />

        <Card className="max-w-2xl mx-auto mt-10 bg-blue-900/40 backdrop-blur-md border border-blue-500/30 rounded-lg overflow-hidden border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Objetivo</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-white">
              Somos estudantes do IFPE – Campus Igarassu e criamos este projeto
              com o objetivo de melhorar a forma de estudo online, oferecendo
              trilhas personalizadas que tornam o aprendizado mais eficiente e direcionado.
            </p>

            <h2 className="text-xl font-semibold text-white">Integrantes</h2>

            <ul className="list-disc list-inside">
              <li className="text-white">Gabriel Henrique</li>
              <li className="text-white">Cristiano</li>
              <li className="text-white">Maviael</li>
              <li className="text-white">Gabriel Suruba</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

