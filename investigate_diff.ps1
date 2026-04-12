$files = git diff origin/master main --name-only
$sizes = @()
foreach ($file in $files) {
    if (Test-Path $file) {
        $info = Get-Item $file
        $sizes += [PSCustomObject]@{
            Name = $info.Name
            FullName = $info.FullName
            Length = $info.Length
        }
    }
}
$sizes | Sort-Object Length -Descending | Select-Object -First 10 | Format-Table Name, @{Name="MB";Expression={[math]::Round($_.Length/1MB,2)}}
$total = ($sizes | Measure-Object -Property Length -Sum).Sum
Write-Host "Total new/changed size to push: $([math]::Round($total/1MB, 2)) MB"
