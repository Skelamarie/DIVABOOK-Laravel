param(
    [string] $ProjectPath = (Split-Path -Parent $PSScriptRoot),
    [string] $PhpPath = '',
    [switch] $DryRun,
    [switch] $SkipConnectionChecks
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath $ProjectPath).Path
$originalLocation = Get-Location
$originalPath = $env:PATH

function Invoke-Checked {
    param([string] $Executable, [string[]] $Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed: $Executable $($Arguments -join ' ')" }
}

try {
    if (-not $PhpPath) {
        $PhpPath = Join-Path $env:USERPROFILE '.config\herd\bin\php84\php.exe'
    }
    if (-not (Test-Path -LiteralPath $PhpPath)) { throw 'Install PHP 8.4 in Herd, or pass -PhpPath with your PHP 8.4 executable.' }
    $PhpPath = (Resolve-Path -LiteralPath $PhpPath).Path
    $env:PATH = (Split-Path -Parent $PhpPath) + ';' + $env:PATH
    Set-Location -LiteralPath $projectRoot
    $probe = Join-Path $projectRoot 'scripts\herd-info.php'
    $runtimeOutput = & $PhpPath $probe
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect PHP requirements.' }
    $runtimeInfo = $runtimeOutput | ConvertFrom-Json
    if ($runtimeInfo.phpVersionId -lt 80401 -or $runtimeInfo.phpVersionId -ge 80500) { throw 'Use PHP 8.4.1 or newer within PHP 8.4.x. Select PHP 8.4 for this site in Herd too.' }
    if (-not $runtimeInfo.mongoVersion -or [version]$runtimeInfo.mongoVersion -lt [version]'2.4.0' -or [version]$runtimeInfo.mongoVersion -ge [version]'3.0.0') {
        throw 'MongoDB PHP extension 2.4+ within 2.x is required by composer.lock. Install a compatible extension for Herd PHP 8.4, restart Herd, and rerun. CI uses MongoDB 2.5.4. See README.md.'
    }
    foreach ($extension in $runtimeInfo.extensions.PSObject.Properties) {
        if (-not $extension.Value) { throw "Enable PHP extension $($extension.Name) for Herd PHP 8.4, restart Herd, and rerun." }
    }
    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $nodeVersionText = & $node --version
    $nodeVersion = [version]$nodeVersionText.TrimStart('v')
    if (-not (($nodeVersion.Major -eq 20 -and $nodeVersion -ge [version]'20.19.0') -or ($nodeVersion.Major -eq 22 -and $nodeVersion -ge [version]'22.18.0') -or $nodeVersion -ge [version]'24.11.0')) { throw 'Use Node 22.18+ within 22.x (matching CI), or Node 24.11+.' }
    $npm = (Get-Command npm.cmd -ErrorAction Stop).Source
    $composerPhar = Join-Path $env:ProgramFiles 'Herd\resources\app.asar.unpacked\resources\bin\composer.phar'
    if (-not (Test-Path -LiteralPath $composerPhar)) { throw 'Herd Composer was not found. Install Herd in its default location, or run the manual README setup commands.' }
    Write-Host "PHP $($runtimeInfo.phpVersion); MongoDB extension $($runtimeInfo.mongoVersion); Node $nodeVersion"
    if (-not $runtimeInfo.fileUploads) { throw 'Enable file_uploads in Herd PHP Settings, restart Herd, and rerun.' }
    if ($runtimeInfo.uploadLimit -lt 5MB -or ($runtimeInfo.postLimit -gt 0 -and $runtimeInfo.postLimit -lt 64MB) -or $runtimeInfo.maxFiles -lt 10) {
        throw 'Set upload_max_filesize=5M, post_max_size=64M, and max_file_uploads>=10 in Herd PHP Settings, restart Herd, and rerun. Larger existing limits are fine.'
    }
    if ($DryRun) { Write-Host 'Runtime preflight passed; nothing was changed.'; exit 0 }

    Invoke-Checked $PhpPath @($composerPhar,'check-platform-reqs','--lock')
    Invoke-Checked $PhpPath @($composerPhar,'install','--prefer-dist','--no-interaction')
    Invoke-Checked $npm @('ci')
    $envFile = Join-Path $projectRoot '.env'
    if (-not (Test-Path -LiteralPath $envFile)) {
        Copy-Item -LiteralPath (Join-Path $projectRoot '.env.example') -Destination $envFile
        Write-Host 'Created .env from the example. Enter your private MongoDB and Cloudinary settings, then rerun this command.'
    }
    $environmentOutput = & $PhpPath $probe --environment
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect environment configuration.' }
    $environmentInfo = $environmentOutput | ConvertFrom-Json
    if (-not $environmentInfo.hasKey) { Invoke-Checked $PhpPath @('artisan','key:generate') }
    Invoke-Checked $PhpPath @('artisan','optimize:clear')
    if (-not $environmentInfo.hasMongoUri -or -not $environmentInfo.hasCloudinary) {
        throw 'Configure MONGODB_URI and Cloudinary credentials privately in .env, then rerun. Your existing APP_KEY is preserved.'
    }
    Invoke-Checked $npm @('run','build')
    Invoke-Checked $PhpPath @($composerPhar,'ci:check')
    if (-not $SkipConnectionChecks) {
        Invoke-Checked $PhpPath @('artisan','mongodb:check')
        Invoke-Checked $PhpPath @('artisan','cloudinary:check')
    }
    Write-Host 'Setup and requested checks passed. Open the site URL shown in Herd and test actual uploads.' -ForegroundColor Green
} finally {
    $env:PATH = $originalPath
    Set-Location -LiteralPath $originalLocation
}
