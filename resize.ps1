Add-Type -AssemblyName System.Drawing
$in1 = "$PSScriptRoot\public\task__manager_icon.png"
$out1 = "$PSScriptRoot\public\task_manager_icon_opt.png"
$img1 = [System.Drawing.Image]::FromFile($in1)
$bmp1 = New-Object System.Drawing.Bitmap 192, 192
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.DrawImage($img1, 0, 0, 192, 192)
$bmp1.Save($out1, [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()
$img1.Dispose()

$in2 = "$PSScriptRoot\public\task__manager_icon_black.png"
$out2 = "$PSScriptRoot\public\task_manager_icon_black_opt.png"
$img2 = [System.Drawing.Image]::FromFile($in2)
$bmp2 = New-Object System.Drawing.Bitmap 192, 192
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.DrawImage($img2, 0, 0, 192, 192)
$bmp2.Save($out2, [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()
$img2.Dispose()
