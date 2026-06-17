<?php
// Quick connection test - delete this file after fixing
$conn = new mysqli('localhost', 'root', '', 'shop_db');

if ($conn->connect_error) {
    echo "<h2 style='color:red'>❌ Connection Failed</h2>";
    echo "<p>" . $conn->connect_error . "</p>";
    echo "<hr><h3>Fix:</h3>";
    echo "<p>Go to <a href='http://localhost/phpmyadmin'>phpMyAdmin</a>, create database <strong>shop_db</strong>, then import <strong>database.sql</strong></p>";
} else {
    $result = $conn->query("SELECT COUNT(*) as total FROM products");
    $row    = $result->fetch_assoc();
    echo "<h2 style='color:green'>✅ Connected!</h2>";
    echo "<p>Database: <strong>shop_db</strong></p>";
    echo "<p>Products in table: <strong>" . $row['total'] . "</strong></p>";
    if ($row['total'] == 0) {
        echo "<p style='color:orange'>⚠️ Table is empty — import database.sql to add sample products</p>";
    }
}
?>
