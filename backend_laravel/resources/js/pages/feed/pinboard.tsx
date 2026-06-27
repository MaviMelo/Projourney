function Pinboard() {
    return (
        <>
            <h1 className="title1 centralize2">Mural Institucional (protótipo)</h1>

            <main>
                <section className="containerGrid2">

                    <article className="card1">
                        <h2 className="textCard">Entregas da Semana.</h2>

                        <h3 className="textCard3">Prioridade 1</h3>
                        <ol className="card1">
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 1</li>
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 2</li>
                        </ol>

                        <h3 className="textCard3">Prioridade 2</h3>
                        <ol className="card1">
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 1</li>
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 2</li>
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 3</li>
                            <li className="elementeCard1"><input type="checkbox" name="" id="" /> Item 4</li>
                        </ol>

                        <button className="button2" type="submit"> Atualizar status de entrega</button>
                    </article>

                    <article>
                        <h1 className="textCard">Comunicados</h1>

                        <div className="card2">
                            <h2 className="textCard3">Institucional</h2>
                            <p className="elementeCard1">Esse é um componente genérico atualmente estático que serve de preencimento do que pode ser um mural de avisos ou similar. Ele deve ser acompanhado de outro recurso onde um usuário de credencial específica (ex.: usuário root) possa editalo via isserção de dados no banco de dados e renderizar as informações aqui.</p>
                        </div>

                        <div className="card2">
                            <h2 className="textCard3">Avisos do Dia</h2>
                            <p className="elementeCard1">Aqui está um parágrafo de exemplo de avisos do dia.</p>
                        </div>

                    </article>
                </section>

            </main>
        </>
    )
}

export default Pinboard;