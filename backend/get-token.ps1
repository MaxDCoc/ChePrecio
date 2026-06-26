# get-token.ps1 — uso: .\get-token.ps1
$response = curl.exe -X POST `
  'https://vtcjqxwnulhtvztjpwdh.supabase.co/auth/v1/token?grant_type=password' `
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y2pxeHdudWxodHZ6dGpwd2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzEwMzksImV4cCI6MjA5NjQ0NzAzOX0.S0oqWvu1zurFuN0T8Sn8e-3ciGXv8owG7WCUHPMrtqk" `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@cheprecio.com\",\"password\":\"test1234!\"}' | ConvertFrom-Json

Write-Host $response.access_token