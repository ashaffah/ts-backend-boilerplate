robocopy prisma dist/prisma /E /XD migrations /XF *.ts
robocopy templates dist/templates /E /XF *.ts
robocopy generated dist/generated /E /XF *.ts
if ($?) { Copy-Item .env dist -Force }