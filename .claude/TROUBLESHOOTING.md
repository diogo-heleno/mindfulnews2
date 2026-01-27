# Troubleshooting

Common issues encountered during development and deployment, with solutions.

## Build Failures

### `npm ci install` — invalid command

```
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Cause**: The Dockerfile had `RUN npm ci install`. The `npm ci` command does not accept `install` as an argument.

**Fix**: Change to `RUN npm ci`. Ensure `package-lock.json` exists and is committed.

---

### `text-sage-900` class does not exist

```
Syntax error: The `text-sage-900` class does not exist.
If `text-sage-900` is a custom class, make sure it is defined within a `@layer` directive.
```

**Cause**: `globals.css` uses `@apply text-sage-900` but `tailwind.config.js` only defined sage shades up to 700.

**Fix**: Add `800` and `900` shades to the sage palette in `tailwind.config.js`:
```js
800: '#2D442D',
900: '#1A2E1A',
```

---

### TypeScript Set iteration error

```
Type 'Set<any>' can only be iterated through when using the '--downlevelIteration' flag
or with a '--target' of 'es2015' or higher.
```

**Cause**: Spreading a Set (`[...new Set(...)]`) requires `downlevelIteration` in TypeScript config.

**Fix**: Use `Array.from(new Set(...))` instead.

---

### `/app/public` not found during Docker build

```
ERROR: failed to calculate checksum of ref: "/app/public": not found
```

**Cause**: The Dockerfile runner stage has `COPY --from=builder /app/public ./public` but the `public/` directory doesn't exist.

**Fix**: Create `frontend/public/.gitkeep` so the directory is tracked by git.

---

## Runtime Issues

### No articles appearing on frontend

1. Check backend logs for errors
2. Verify Supabase credentials are correct
3. Ensure RSS sources are active:
   ```sql
   SELECT * FROM sources WHERE is_active = true;
   ```
4. Check raw articles were fetched:
   ```sql
   SELECT COUNT(*) FROM raw_articles WHERE processed = false;
   ```
5. Check processing runs:
   ```sql
   SELECT * FROM processing_runs ORDER BY started_at DESC LIMIT 5;
   ```

### Backend fails with `Could not find column in schema cache`

```
{'message': "Could not find the 'at_a_glance' column of 'articles' in the schema cache", 'code': 'PGRST204'}
```

**Causa**: O backend tenta inserir dados numa coluna que existe na tabela mas o PostgREST (Supabase) ainda não atualizou o schema cache após um `ALTER TABLE`.

**Fix**:
1. Verificar que a coluna existe na tabela:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'articles' ORDER BY ordinal_position;
   ```
2. Recarregar o schema cache do PostgREST:
   - No Supabase Dashboard, ir a **Settings → API → Reload schema cache**
   - Ou via SQL: `NOTIFY pgrst, 'reload schema';`
3. Se o problema persistir, reiniciar o serviço PostgREST do Supabase

---

### Backend fails silently

1. Verify `ANTHROPIC_API_KEY` is valid and has credits
2. Verify `SUPABASE_SERVICE_KEY` has write permissions (service_role, not anon)
3. Check network connectivity to RSS feed URLs
4. Run manually to see logs: `docker compose run --rm backend`

### Frontend shows stale data

The RSS feed endpoint caches for 1 hour (`max-age=3600`). Article pages are server-rendered on demand. If data appears stale:
1. Check that the backend ran recently: `SELECT * FROM processing_runs ORDER BY started_at DESC LIMIT 1;`
2. Hard refresh the browser (Ctrl+Shift+R)

### Docker build warnings about secrets in ARG/ENV

```
SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data
```

These are best-practice warnings, not errors. The build still succeeds. To fix properly, use Docker BuildKit secrets:
```dockerfile
RUN --mount=type=secret,id=api_key ...
```

## VPS Issues

### Projeto não encontrado (`No such file or directory`)

```
-bash: cd: /home/diogo/mindfulnews2: No such file or directory
```

**Causa**: O projeto não está em `~/mindfulnews2`. Na VPS, o caminho correto é `/opt/mindfulnews2`.

**Fix**: Usar sempre o caminho absoluto:
```bash
cd /opt/mindfulnews2
```

---

### `docker compose` diz `no configuration file provided`

```
no configuration file provided: not found
```

**Causa**: Estás fora do diretório do projeto. O `docker-compose.yml` está em `/opt/mindfulnews2/`.

**Fix**:
```bash
cd /opt/mindfulnews2
docker compose run --rm backend
```

---

### `python` não encontrado na VPS

```
Command 'python' not found
```

**Causa**: Na VPS Ubuntu, o comando é `python3`, não `python`.

**Fix**: Usar `python3` ou instalar o pacote `python-is-python3`:
```bash
sudo apt install python-is-python3
```

---

### Cron log file não é criado (`Permission denied`)

O cron corre como user `diogo` mas `/var/log/` pertence a `root`. O ficheiro de log nunca é criado.

**Fix**: Criar o ficheiro e dar permissões ao user:
```bash
sudo touch /var/log/mindfulnews.log
sudo chown diogo:diogo /var/log/mindfulnews.log
```

Ou usar um caminho onde o user tem permissão:
```bash
crontab -e
# Mudar para:
0 */4 * * * cd /opt/mindfulnews2 && docker compose run --rm backend >> /opt/mindfulnews2/backend.log 2>&1
```

---

## Supabase Issues

See `.claude/SUPABASE.md` for database-specific troubleshooting.
