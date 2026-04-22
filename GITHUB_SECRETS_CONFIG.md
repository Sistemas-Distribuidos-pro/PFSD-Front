# Configuración GitHub Actions - Frontend

## Valores desde Terraform

Basado en `terraform output` del ambiente **local**:

```
S3 Bucket: local-ecommerce-frontend-414813662494
Frontend URL: http://local-ecommerce-frontend-414813662494.s3-website-us-east-1.amazonaws.com
Order service URL: http://3.226.76.177:8081
Auth service URL: http://3.226.76.177:8082
Catalog service URL: http://3.226.76.177:8083
AWS Region: us-east-1
```

---

## Secrets Requeridos

### 1. AWS_ACCESS_KEY_ID
```bash
gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."
```
**Valor:** Tu AWS Access Key ID con permisos de S3

### 2. AWS_SECRET_ACCESS_KEY
```bash
gh secret set AWS_SECRET_ACCESS_KEY --body "..."
```
**Valor:** Tu AWS Secret Access Key

### 3. S3_BUCKET_NAME
```bash
gh secret set S3_BUCKET_NAME --body "local-ecommerce-frontend-414813662494"
```
**Valor:** `local-ecommerce-frontend-414813662494`

---

## Variables Requeridas

### 4. VITE_ORDER_SERVICE_URL
```bash
gh variable set VITE_ORDER_SERVICE_URL --body "http://3.226.76.177:8081"
```
**Valor:** `http://3.226.76.177:8081` (order-service)

**Importante:** Esta variable se usa en build time para que el frontend sepa dónde está el order-service.

### 5. VITE_AUTH_SERVICE_URL
```bash
gh variable set VITE_AUTH_SERVICE_URL --body "http://3.226.76.177:8082"
```
**Valor:** `http://3.226.76.177:8082` (auth-service)

### 6. VITE_CATALOG_SERVICE_URL
```bash
gh variable set VITE_CATALOG_SERVICE_URL --body "http://3.226.76.177:8083"
```
**Valor:** `http://3.226.76.177:8083` (catalog-service)

---

## Variables Opcionales

### 5. AWS_REGION
```bash
gh variable set AWS_REGION --body "us-east-1"
```
**Default:** `us-east-1` (ya configurado en workflow)

### 6. FRONTEND_WEBSITE_URL
```bash
gh variable set FRONTEND_WEBSITE_URL --body "http://local-ecommerce-frontend-414813662494.s3-website-us-east-1.amazonaws.com"
```
**Default:** Se muestra el bucket S3 (opcional, solo para mensajes)

---

## Configuración Manual en GitHub

Si prefieres usar la UI de GitHub:

1. Ve a tu repositorio frontend en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. En la pestaña **Secrets**:
   - Click **New repository secret**
   - Nombre: `AWS_ACCESS_KEY_ID`, Valor: [tu access key]
   - Click **New repository secret**
   - Nombre: `AWS_SECRET_ACCESS_KEY`, Valor: [tu secret key]
   - Click **New repository secret**
   - Nombre: `S3_BUCKET_NAME`, Valor: `local-ecommerce-frontend-414813662494`

4. En la pestaña **Variables**:
   - Click **New repository variable**
   - Nombre: `VITE_ORDER_SERVICE_URL`, Valor: `http://3.226.76.177:8081`
   - Nombre: `VITE_AUTH_SERVICE_URL`, Valor: `http://3.226.76.177:8082`
   - Nombre: `VITE_CATALOG_SERVICE_URL`, Valor: `http://3.226.76.177:8083`
   - Click **New repository variable** (opcional)
   - Nombre: `AWS_REGION`, Valor: `us-east-1`
   - Click **New repository variable** (opcional)
   - Nombre: `FRONTEND_WEBSITE_URL`, Valor: `http://local-ecommerce-frontend-414813662494.s3-website-us-east-1.amazonaws.com`

---

## Verificación

Una vez configurado, el workflow se ejecutará automáticamente al hacer push a `main` o `develop`:

```bash
git add .
git commit -m "Deploy frontend"
git push origin main
```

Verifica el despliegue:
```bash
# Ver contenido del bucket
aws s3 ls s3://local-ecommerce-frontend-414813662494/

# Abrir en navegador
start http://local-ecommerce-frontend-414813662494.s3-website-us-east-1.amazonaws.com
```

---

## Importante: CORS en Servicios

Para que el frontend pueda comunicarse con los servicios, asegúrate de que tengan CORS configurado correctamente en:

```java
// src/main/java/com/monolito/ecommerce/config/CorsConfig.java
allowedOrigins = "http://local-ecommerce-frontend-414813662494.s3-website-us-east-1.amazonaws.com"
```

O permitir todos los orígenes en desarrollo:
```java
allowedOrigins = "*"
```

---

## Troubleshooting

### Error: "Falta secret S3_BUCKET_NAME"
**Solución:** Configura el secret S3_BUCKET_NAME con `local-ecommerce-frontend-414813662494`

### Error: "Falta VITE_ORDER_SERVICE_URL"
**Solución:** Configura la variable VITE_ORDER_SERVICE_URL con `http://3.226.76.177:8081`

### Error: "Access Denied" en S3
**Solución:** Verifica que AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY tengan permisos `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` y `s3:ListBucket` en el bucket

### Frontend no se conecta a los servicios
**Solución:** 
1. Verifica que las tres variables VITE_* apunten a los servicios correctos
2. Verifica CORS en los servicios
3. Verifica que los servicios estén corriendo: `curl http://3.226.76.177:8081`, `curl http://3.226.76.177:8082`, `curl http://3.226.76.177:8083`

---

## Variables de Entorno en Vite

El frontend usa variables de entorno con el prefijo `VITE_`. Durante el build, estas variables se incluyen en el código compilado:

```javascript
// En tu código frontend puedes usar:
const ORDER_URL = import.meta.env.VITE_ORDER_SERVICE_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const CATALOG_URL = import.meta.env.VITE_CATALOG_SERVICE_URL;
```

---

**Última actualización:** 27 de Febrero 2026
**Terraform Environment:** local
