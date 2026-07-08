import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <main className="p-8 max-w-4xl mx-auto">

      <h1 className="textBanner">Sobre o sistema:</h1>
      <p>

        O <a href="https://github.com/MaviMelo/Projourney" className="linkGreen2">Projourney</a> é um projeto acadêmico desenvolvido por estudantes do curso de Tecnologia de Sistemas para a Internet - TSI - do Instituto Federal de Pernambuco, Campos Igarassu. O mesmo tem, na sua origem, como principal objetivo o redirecionamento de seus usuários para cursos onlines gratuitos com boa aprovação ou avaliação popular. Permitindo seguir uma sequência de cursos online, denominadas como <strong>Trilhas</strong>, que formam o conteúdo educacional necessário para uma determinada formação profissional/pessoal.

      </p>

      <Card className="card1">

        <CardHeader className="itemsJustify2">
          <CardTitle>Mais Informações sobre o projeto:</CardTitle>
        </CardHeader>

        <CardContent className="">

          <h2 className="textCard2">Recursos disponíveis:</h2>

          <ul className="list-disc list-inside">
            <li>Seguir trilhas de estudos;</li>
            <li>Mural de cursos divulgados por instituições de ensino.</li>
          </ul>

          <h2 className="textCard2">Recursos futuros:</h2>

          <ul className="list-disc list-inside">
            <li>Criar trilhas personalizadas com os cursos ofertados;</li>
            <li>Avaliar/comentar os cursos.</li>
          </ul>

          <h2 className="textCard2">Mantenedores do Prejeto:</h2>

          <ul className="list-disc list-inside">
            <li><a href="https://github.com/crocodileBigger" className="linkGreen2" target="_blank" rel="noopener noreferrer">Gabriel Henrique</a></li>
            <li><a href="https://github.com/Diego-jpeg-27" className="linkGreen2" target="_blank" rel="noopener noreferrer">José Diego</a></li>
            <li><a href="https://github.com/MaviMelo/" className="linkGreen2" target="_blank" rel="noopener noreferrer">Maviael Melo</a></li>
            <li><a href="https://github.com/VSoares27" className="linkGreen2" target="_blank" rel="noopener noreferrer">Victor Soares</a></li>

            <h2 className="textCard2">Veja Também:</h2>
            <ul className="list-disc list-inside">
              <li>
                <a href="https://github.com/MaviMelo/Projourney" className="linkGreen2" target="_blank" rel="noopener noreferrer"> Mais informações sobre o projeto.</a>
              </li>
            </ul>

          </ul>
        </CardContent>

      </Card>
    </main>
  )
}
