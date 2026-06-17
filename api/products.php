<?php
require_once 'config.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Get the action from query string e.g. ?action=getAll
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {

    // ─── READ ────────────────────────────────────────────────────────────────
    case 'GET':
        if ($action === 'getOne') {
            // GET /api/products.php?action=getOne&id=1
            $id = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();

            if ($product) {
                echo json_encode($product);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }

        } else {
            // GET /api/products.php  — list all or search
            // Optional: ?search=keyword&category=Electronics
            $where    = [];
            $params   = [];
            $types    = '';

            if (!empty($_GET['search'])) {
                $where[]  = "(name LIKE ? OR description LIKE ?)";
                $keyword  = '%' . $_GET['search'] . '%';
                $params[] = $keyword;
                $params[] = $keyword;
                $types   .= 'ss';
            }

            if (!empty($_GET['category'])) {
                $where[]  = "category = ?";
                $params[] = $_GET['category'];
                $types   .= 's';
            }

            $sql = "SELECT * FROM products";
            if (!empty($where)) {
                $sql .= " WHERE " . implode(" AND ", $where);
            }
            $sql .= " ORDER BY created_at DESC";

            $stmt = $conn->prepare($sql);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result   = $stmt->get_result();
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            echo json_encode($products);
        }
        break;

    // ─── CREATE ──────────────────────────────────────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Validate required fields
        if (empty($data['name']) || empty($data['price']) || empty($data['category'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, price and category are required']);
            break;
        }

        $name        = $data['name'];
        $description = $data['description'] ?? '';
        $price       = floatval($data['price']);
        $image       = !empty($data['image']) ? $data['image'] : 'https://placehold.co/400x300?text=No+Image';
        $category    = $data['category'];
        $stock       = intval($data['stock'] ?? 0);

        $stmt = $conn->prepare(
            "INSERT INTO products (name, description, price, image, category, stock)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->bind_param("ssdssi", $name, $description, $price, $image, $category, $stock);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Product created successfully',
                'id'      => $conn->insert_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create product']);
        }
        break;

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    case 'PUT':
        $id   = intval($_GET['id']);
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['price']) || empty($data['category'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, price and category are required']);
            break;
        }

        $name        = $data['name'];
        $description = $data['description'] ?? '';
        $price       = floatval($data['price']);
        $category    = $data['category'];
        $stock       = intval($data['stock'] ?? 0);

        // If no new image uploaded, keep the existing one
        if (!empty($data['image'])) {
            $image = $data['image'];
            $stmt = $conn->prepare(
                "UPDATE products
                 SET name=?, description=?, price=?, image=?, category=?, stock=?
                 WHERE id=?"
            );
            $stmt->bind_param("ssdssii", $name, $description, $price, $image, $category, $stock, $id);
        } else {
            // Keep existing image — don't update image column
            $stmt = $conn->prepare(
                "UPDATE products
                 SET name=?, description=?, price=?, category=?, stock=?
                 WHERE id=?"
            );
            $stmt->bind_param("ssdsii", $name, $description, $price, $category, $stock, $id);
        }

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Product updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update product']);
        }
        break;

    // ─── DELETE ──────────────────────────────────────────────────────────────
    case 'DELETE':
        $id   = intval($_GET['id']);
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['message' => 'Product deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete product']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();
?>
