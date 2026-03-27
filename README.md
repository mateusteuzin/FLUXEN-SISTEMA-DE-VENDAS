# Loja Simples Facil

## Rodando localmente

No Windows PowerShell, prefira `npm.cmd` em vez de `npm` para evitar bloqueio do `npm.ps1`.

```powershell
npm.cmd install
npm.cmd run dev
```

Servidor local:

```text
http://127.0.0.1:8080
```

## Modo local sem email

Se voce quiser testar sem Supabase e sem confirmacao por email, use:

```env
VITE_APP_MODE="local"
```

Nesse modo os dados ficam no `localStorage` do navegador.

## Build de producao

```powershell
npm.cmd run build
```
