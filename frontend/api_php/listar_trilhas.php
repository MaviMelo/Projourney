<?php
require_once "db.php"; // Reutiliza sua conexão com o banco

// --- Configuração dos Headers CORS e Content-Type ---
header("Access-Control-Allow-Origin: *"); // Em produção, use o domínio do seu app React
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Responde a requisições pre-flight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

// --- Lógica para Buscar as Trilhas ---
try {
    // Prepara uma consulta SQL para selecionar o ID e o nome de todas as trilhas
    $stmt = $pdo->prepare("SELECT id, nome FROM trilha ORDER BY nome ASC");
    
    // Executa a consulta
    $stmt->execute();

    // Busca todos os resultados e armazena no array $trilhas
    $trilhas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retorna uma resposta de sucesso (código 200) com os dados das trilhas em formato JSON
    http_response_code(200 );
    echo json_encode($trilhas);

} catch (PDOException $e) {
    // Em caso de erro na consulta ao banco de dados
    http_response_code(500 ); // Internal Server Error
    echo json_encode([
        "status" => "erro", 
        "mensagem" => "Erro ao buscar as trilhas no servidor."
    ]);
}
?>
