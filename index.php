<?php
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(404);
    exit('QR no encontrado');
}

// Configura tu URL y clave de Supabase
$supabaseUrl = 'https://zqrrrjbqrfftvtwiohys.supabase.co';
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcnJyamJxcmZmdHZ0d2lvaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjY5ODgsImV4cCI6MjA3NjU0Mjk4OH0.Ui4xM8Q9IV9hyHUIQW0UwwB60CtaJ2eTAR4ggZ4laAM';

// Consulta la tabla qrcodes por id
$ch = curl_init("$supabaseUrl/rest/v1/qrcodes?id=eq.$id&select=destination_url");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $supabaseKey",
    "Authorization: Bearer $supabaseKey"
]);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (!$data || empty($data[0]['destination_url'])) {
    http_response_code(404);
    exit('QR no encontrado');
}

header('Location: ' . $data[0]['destination_url'], true, 302);
exit;
?>