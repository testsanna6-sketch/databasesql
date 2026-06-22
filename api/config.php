<?php
// Database configuration
define('DB_HOST', 'sql306.infinityfree.com');
define('DB_USER', 'if0_42240276');
define('DB_PASS', 'IJeQJyuVEgo');
define('DB_NAME', 'if0_42240276_shop_db');

// CORS headers - allow frontend to call the API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create database connection
function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}
?>
