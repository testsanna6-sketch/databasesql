<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded or upload error']);
    exit();
}

$file     = $_FILES['image'];
$allowed  = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize  = 5 * 1024 * 1024; // 5MB

// Validate file type
if (!in_array($file['type'], $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Only JPG, PNG, GIF and WEBP images are allowed']);
    exit();
}

// Validate file size
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Image must be smaller than 5MB']);
    exit();
}

// Create uploads folder if not exists
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_', true) . '.' . strtolower($ext);
$destPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destPath)) {
    // Return the relative URL path
    echo json_encode([
        'success' => true,
        'path'    => 'uploads/' . $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save image']);
}
?>
