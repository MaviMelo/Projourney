<?php
require_once "db.php"; // Reutiliza sua conexão com o banco

// --- Configuração dos Headers CORS e Content-Type ---
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Responde a requisições pre-flight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

// --- Lógica para Inscrição na Trilha ---

// 1. Pega o corpo da requisição (JSON) e decodifica para um objeto PHP
$dados = json_decode(file_get_contents("php://input"));

// 2. Validação para garantir que os IDs foram enviados e são numéricos
if (
    !isset($dados->alunoId) || !is_numeric($dados->alunoId) ||
    !isset($dados->trilhaId) || !is_numeric($dados->trilhaId)
) {
    http_response_code(400 ); // Bad Request
    echo json_encode(["status" => "erro", "mensagem" => "Dados inválidos. ID do aluno e da trilha são obrigatórios."]);
    exit();
}

$aluno_id = $dados->alunoId;
$trilha_id = $dados->trilhaId;

// 3. (Opcional, mas recomendado) Verificar se o aluno já está inscrito na trilha
try {
    $stmt = $pdo->prepare("SELECT * FROM trilha_aluno WHERE aluno_id = ? AND trilha_id = ?");
    $stmt->execute([$aluno_id, $trilha_id]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(409 ); // Conflict
        echo json_encode(["status" => "erro", "mensagem" => "Você já está inscrito nesta trilha."]);
        exit();
    }
} catch (PDOException $e) {
    http_response_code(500 );
    echo json_encode(["status" => "erro", "mensagem" => "Erro ao verificar inscrição existente."]);
    exit();
}


// 4. Inserir o novo registro na tabela de associação
$sql = "INSERT INTO trilha_aluno (aluno_id, trilha_id, progresso) VALUES (?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    // O valor padrão 'Inscrito' é definido no banco, mas podemos ser explícitos aqui
    $stmt->execute([$aluno_id, $trilha_id, 'Inscrito']);

    // Retorna uma resposta de sucesso
    http_response_code(201 ); // Created
    echo json_encode([
        "status" => "sucesso",
        "mensagem" => "Inscrição na trilha realizada com sucesso!"
    ]);

} catch (PDOException $e) {
    // Trata erros de chave estrangeira (ex: alunoId ou trilhaId não existem) ou outros erros de BD
    http_response_code(500 );
    // Mensagem de erro genérica para o usuário por segurança
    echo json_encode([
        "status" => "erro", 
        "mensagem" => "Não foi possível concluir a inscrição. Verifique os dados e tente novamente."
        // "debug_info" => $e->getMessage() // Descomente apenas para depuração
    ]);
}
?>
