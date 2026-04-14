<?php
require_once __DIR__. '/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
};

// Pega o corpo da requisição (texto JSON) e decodifica para um objeto PHP.
$dados = json_decode(file_get_contents("php://input"));

// Validação simples para garantir dados não vasios.
if (empty($dados->email) || empty($dados->password)) {
    http_response_code(400); // Define o código de status HTTP para "Bad Request".
    echo json_encode(["status" => "erro", "mensagem" => "E-mail e senhas são obrigatórios."]);
    exit();
}

// Inicia um bloco try...catch (tentar...pegar) para capiturar erros do Banco de Dados.
try {
    // prepara uma consulta SQL segura...
    $stmt = $pdo->prepare(" SELECT id, nome, senha FROM aluno WHERE email = ?");
    // executa a consulta. 
    $stmt->execute([$dados->email]);

    // Busca os dados. $aluno armazena o resultado.
    $aluno = $stmt->fetch();

    // '$aluno' checa usuário foi encontrado.
    // 'password_veryfy' compara senha fonecida no front-end com o hash armaxenado no banco de dados.
    if ($aluno && password_verify($dados->password, $aluno['senha'])) {

        unset($aluno['senha']); // Remove a senha do array por segurança.

        http_response_code(200); // código de status 'OK'.
        echo json_encode([
            "status" => "sucesso",
            "mensagem" => "Login realizado com sucesso!",
            "dados_usuario" => $aluno
        ]);
    } else {
        http_response_code(401); // Código de status "Unauthorized".
        echo json_encode([
            "status" => "erro",
            "mensagem" => "Credenciais inválidas. Verifique email e senha."
        ]);
    }
} catch (PDOException $e) {
    // caso ocorra erro de conexão com o banco de dados.
    http_response_code(500); // código de atatus "Iternal Server Error".
    echo json_encode(["status" => "erro", "mensagem" => "Erro no servidor."]);
}
