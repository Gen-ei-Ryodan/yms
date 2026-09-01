# Deployment

## Production host

- SSH alias: `alurelab`
- Repository: `/home/alurelab/repositories/yms`
- Domain webroot: `/home/alurelab/yms.solusisurabaya.com`

The Next.js dashboard uses static export and is copied into `yms-backend/public` so the same domain can serve the dashboard while Laravel handles `/api/v1`.

Production build:

```bash
cd yms-frontend
NEXT_PUBLIC_API_URL=https://yms.solusisurabaya.com/api/v1 npm run build
```

The resulting `out/` is copied to `yms-backend/public` while preserving Laravel's `index.php`, `.htaccess`, and API routing.
