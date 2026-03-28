Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.Streams.IRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime] | Out-Null

function Await($WinRtTask, $ResultType) {
    $asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and !($_.GetParameters()[0].ParameterType.IsGenericType)})[0]
    $asTaskConverted = $asTask.MakeGenericMethod($ResultType)
    $netTask = $asTaskConverted.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

function AwaitAction($WinRtTask) {
    $asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.IsGenericType})[0]
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
}

$pdfPath = 'C:\Users\ASUS\Downloads\BEJOICE GROUP OF COMPANIES LOGO.pdf'
$outPath = 'C:\Users\ASUS\Desktop\premium\public\logo-from-pdf.png'

$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
$doc  = Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])

Write-Host "Pages: $($doc.PageCount)"
$page = $doc.GetPage(0)
Write-Host "Page size: $($page.Size.Width) x $($page.Size.Height)"

$outFile = [System.IO.File]::Open($outPath, [System.IO.FileMode]::Create)
$stream = [System.IO.WindowsRuntimeStreamExtensions]::AsRandomAccessStream($outFile)

$renderOptions = [Windows.Data.Pdf.PdfPageRenderOptions]::new()
$renderOptions.DestinationWidth = 4000

AwaitAction ($page.RenderToStreamAsync($stream, $renderOptions))

$stream.Dispose()
$outFile.Close()

Write-Host "Done: $outPath"
