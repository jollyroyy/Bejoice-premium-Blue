$base = "c:\Users\ASUS\Desktop\premium - Copy"

$folders = @(".git", "public", "node_modules", "public\frames1", "public\frames2", "public\frames4", "public\frames5", "public\frames6", "public\frames7", "public\frames8", "public\3d", "public\saudi", "public\bejoice_truck", "public\port", "public\tech_enng", "public\frames1_highres")

foreach ($folder in $folders) {
    $path = Join-Path $base $folder
    if (Test-Path $path) {
        $size = (Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $sizeGB = [math]::Round($size / 1GB, 3)
        $sizeMB = [math]::Round($size / 1MB, 1)
        Write-Host "$folder : $sizeMB MB ($sizeGB GB)"
    } else {
        Write-Host "$folder : NOT FOUND"
    }
}

# Total project size
$totalSize = (Get-ChildItem -Path $base -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
$totalGB = [math]::Round($totalSize / 1GB, 3)
Write-Host "`nTOTAL PROJECT: $totalGB GB"

# Check git history for large files
Write-Host "`n--- Large files in git history ---"
Set-Location $base
git rev-list --objects --all 2>$null | ForEach-Object {
    $parts = $_ -split ' ', 2
    if ($parts.Count -eq 2) {
        $hash = $parts[0]
        $path = $parts[1]
        $size = git cat-file -s $hash 2>$null
        if ($size -and [int64]$size -gt 10485760) {
            $sizeMB = [math]::Round([int64]$size / 1MB, 1)
            Write-Host "$sizeMB MB : $path"
        }
    }
}
