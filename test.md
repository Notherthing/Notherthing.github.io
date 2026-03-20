
## Full Restart For Local Preview

Important: run the commands in this file from the project root, not from `C:\Windows\System32`.

### 1. Go to project root

```powershell
cd D:\Github\Notherthing.github.io
```

### 2. Stop the old preview process on port 4000

```powershell
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue |
	Select-Object -ExpandProperty OwningProcess -Unique |
	ForEach-Object { Stop-Process -Id $_ -Force }
```

### 3. Start Jekyll again

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
bundle exec jekyll serve -H localhost -P 4000 --livereload
```

### One-command version

```powershell
Set-Location D:\Github\Notherthing.github.io
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue |
	Select-Object -ExpandProperty OwningProcess -Unique |
	ForEach-Object { Stop-Process -Id $_ -Force }
bundle exec jekyll serve -H localhost -P 4000 --livereload
```

### 4. Open preview

http://localhost:4000