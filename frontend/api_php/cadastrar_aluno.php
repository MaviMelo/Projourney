<?php
require_once 'db.php';

// Habilita o CORS para permitir que seu app React acesse a API
header("Access-Control-Allow-Origin: *"); // Em produção, troque "*" pelo seu domínio real
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permitir POST e OPTIONS (para pre-flight)
header("Access-Control-Max-Age: 86400"); // Cache por 1 dia
header('Content-Type: application/json; charset=utf-8');

// Se a requisição for OPTIONS (pre-flight request), apenas retorne OK.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Lógica de Cadastro ---

// 1. Receber e decodificar os dados JSON enviados pelo React
// O `true` no final converte para um array associativo, que é mais fácil de verificar com `empty()`
$dados = json_decode(file_get_contents('php://input'), true);

// Se o JSON for inválido ou vazio, $dados será null.
if ($dados === null) {
    http_response_code(400 );
    echo json_encode(["status" => "erro", "mensagem" => "Corpo da requisição inválido ou vazio."]);
    exit;
}

// 2. Validação de segurança aprimorada
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$senha = $dados['senha'] ?? '';
$data_nascimento = $dados['data_nascimento'] ?? '';
$telefone = trim($dados['telefone'] ?? '');

if (
    empty($nome) || // Apenas checa se não está vazio
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    empty($senha) ||
    empty($data_nascimento) || 
    empty($telefone)
) {
    http_response_code(400 ); // Bad Request
    echo json_encode(["status" => "erro", "mensagem" => "Dados obrigatórios ausentes ou inválidos."]);
    exit;
}

// Validação específica para a data (após garantir que não está vazia)
$d = DateTime::createFromFormat('Y-m-d', $data_nascimento);
if (!$d || $d->format('Y-m-d') !== $data_nascimento) {
    http_response_code(400 );
    echo json_encode(["status" => "erro", "mensagem" => "Formato de data de nascimento inválido. Use AAAA-MM-DD."]);
    exit;
}


// 3. Preparar os dados para inserção (agora usando o array $dados)
$senhaHash = password_hash($senha, PASSWORD_ARGON2ID);
$telefoneLimpo = preg_replace('/[^0-9]/', '', $telefone);

$cidade = isset($dados['cidade']) ? trim($dados['cidade']) : null;
$descricao = isset($dados['objetivos']) ? trim($dados['objetivos']) : null;
$area_interesse = isset($dados['areasInteresse']) ? implode(', ', $dados['areasInteresse']) : null;


// 4. Verificar se o e-mail já existe
try {
    $stmt = $pdo->prepare("SELECT id FROM aluno WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["status" => "erro", "mensagem" => "Este e-mail já está cadastrado."]);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "erro", "mensagem" => "Erro ao verificar e-mail: " . $e->getMessage()]);
    exit;
}

// 5. Inserir o novo aluno no banco
$sql = "INSERT INTO aluno (nome, email, data_nascimento, telefone, senha, cidade, descricao, area_interesse) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $nome,
        $email,
        $data_nascimento,
        $telefoneLimpo,
        $senhaHash,
        $cidade,
        $descricao,
        $area_interesse
    ]);

    http_response_code(201); // Created
    echo json_encode(["status" => "sucesso", "mensagem" => "Aluno cadastrado com sucesso!"]);
} catch (PDOException $e) {
    // ESTE É O BLOCO CRÍTICO PARA DEBUG
    http_response_code(500);
    // Registra o erro no log do servidor para você ver
    error_log("Erro de PDO na inserção: " . $e->getMessage()); 
    // Retorna uma mensagem de erro genérica para o frontend
    echo json_encode(["status" => "erro", "mensagem" => "Erro interno do servidor. Por favor, tente novamente mais tarde."]);
    exit;
}
