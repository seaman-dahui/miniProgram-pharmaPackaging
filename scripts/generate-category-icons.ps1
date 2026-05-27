$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$size = 128
$outDir = Join-Path $PSScriptRoot '..\src\static\categories'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-CategoryIcon([string]$name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(253, 232, 232))

  $color = [System.Drawing.ColorTranslator]::FromHtml('#E20101')
  $pen = New-Object System.Drawing.Pen $color, 5
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $brush = New-Object System.Drawing.SolidBrush $color

  switch ($name) {
    'labeling' {
      # Tag / label (贴标机)
      $points = @(
        (New-Object System.Drawing.PointF 36, 28),
        (New-Object System.Drawing.PointF 88, 28),
        (New-Object System.Drawing.PointF 88, 72),
        (New-Object System.Drawing.PointF 52, 72),
        (New-Object System.Drawing.PointF 36, 88)
      )
      $g.FillPolygon($brush, $points)
      $g.DrawLine($pen, 52, 72, 36, 88)
      $g.DrawLine($pen, 48, 48, 76, 48)
      $g.DrawLine($pen, 48, 58, 70, 58)
    }
    'pallet' {
      # Stacked trays (制托机)
      $g.DrawRectangle($pen, 28, 78, 72, 10)
      $g.DrawRectangle($pen, 32, 58, 64, 10)
      $g.DrawRectangle($pen, 36, 38, 56, 10)
      $g.FillRectangle($brush, 44, 22, 40, 14)
    }
    'sleeve' {
      # Bottle + sleeve band (套标机)
      $g.DrawEllipse($pen, 46, 24, 36, 14)
      $g.DrawLine($pen, 46, 31, 46, 88)
      $g.DrawLine($pen, 82, 31, 82, 88)
      $g.DrawArc($pen, 38, 78, 52, 18, 0, 180)
      $g.FillRectangle($brush, 40, 48, 48, 12)
    }
  }

  $g.Dispose()
  return $bmp
}

@('labeling', 'pallet', 'sleeve') | ForEach-Object {
  $bmp = New-CategoryIcon $_
  $path = Join-Path $outDir "$_.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Generated $path"
}

Write-Host "Done: $outDir"
