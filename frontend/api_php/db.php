<?php

// --- Conexão com o Banco de Dados ---
$servidor = "localhost:3306";
$usuario_bd = "root";
$senha_bd = "root";
$banco = "projourney_2";

try {
    $pdo = new PDO("mysql:host=$servidor;dbname=$banco;charset=utf8", $usuario_bd, $senha_bd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "erro", "mensagem" => "Erro na conexão com o banco de dados: " . $e->getMessage()]);
    exit;
}
