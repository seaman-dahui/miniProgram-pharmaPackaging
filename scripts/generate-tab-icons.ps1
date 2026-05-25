$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$size = 81
$outDir = Join-Path $PSScriptRoot '..\src\static\tabs'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-IconBitmap([string]$name, [string]$colorHex) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  $color = [System.Drawing.ColorTranslator]::FromHtml($colorHex)
  $pen = New-Object System.Drawing.Pen $color, 4
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $brush = New-Object System.Drawing.SolidBrush $color

  switch ($name) {
    'home' {
      $points = @(
        (New-Object System.Drawing.PointF 40.5, 18),
        (New-Object System.Drawing.PointF 62, 34),
        (New-Object System.Drawing.PointF 62, 58),
        (New-Object System.Drawing.PointF 19, 58),
        (New-Object System.Drawing.PointF 19, 34)
      )
      $g.DrawPolygon($pen, $points)
      $g.FillRectangle($brush, 32, 42, 17, 16)
    }
    'products' {
      $g.DrawRectangle($pen, 18, 18, 20, 20)
      $g.DrawRectangle($pen, 43, 18, 20, 20)
      $g.DrawRectangle($pen, 18, 43, 20, 20)
      $g.DrawRectangle($pen, 43, 43, 20, 20)
    }
    'about' {
      $g.DrawEllipse($pen, 24, 18, 33, 33)
      $g.FillEllipse($brush, 34, 28, 13, 13)
      $g.FillRectangle($brush, 28, 54, 25, 12)
    }
    'news' {
      $g.DrawRectangle($pen, 20, 22, 41, 37)
      $g.DrawLine($pen, 28, 32, 53, 32)
      $g.DrawLine($pen, 28, 42, 53, 42)
      $g.DrawLine($pen, 28, 52, 45, 52)
    }
  }

  $g.Dispose()
  return $bmp
}

$icons = @('home', 'products', 'news', 'about')
foreach ($icon in $icons) {
  $normal = New-IconBitmap $icon '#6B7280'
  $selected = New-IconBitmap $icon '#E20101'
  $normal.Save((Join-Path $outDir "$icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $selected.Save((Join-Path $outDir "$icon-select.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $normal.Dispose()
  $selected.Dispose()
}

Write-Host "Generated tab icons in $outDir"
