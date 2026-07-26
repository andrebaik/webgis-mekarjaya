Write-Host "POST /api/admin/locations (Create Location)"
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer supersecretadmin123")
$headers.Add("Content-Type", "application/json")

$body = '{
    "slug": "test-location-1",
    "category_id": 1,
    "name_id": "Test Location 1",
    "name_su": "Lokasi Tes 1",
    "name_en": "Test Location 1",
    "coordinates": "[-6.9, 107.6]"
}'

try {
    $response = Invoke-RestMethod 'http://localhost:5000/api/admin/locations' -Method 'POST' -Headers $headers -Body $body
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)"
}

Write-Host "------------------------"
Write-Host "GET /api/locations (All Locations)"
try {
    $response = Invoke-RestMethod 'http://localhost:5000/api/locations' -Method 'GET'
    Write-Host "Response: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Host "Error: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)"
}

Write-Host "------------------------"
Write-Host "DELETE /api/admin/locations/:id (Delete Location)"
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer supersecretadmin123")

try {
    # Assuming the created location has ID 1 - this might need adjustment
    $response = Invoke-RestMethod 'http://localhost:5000/api/admin/locations/1' -Method 'DELETE' -Headers $headers
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)"
}
