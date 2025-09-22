# 🚀 GUÍA DE DEPLOYMENT EN RENDER.COM

## 📋 PASOS PARA DEPLOY (30 MINUTOS MÁXIMO)

### 1️⃣ CREAR CUENTA EN RENDER
- Ve a https://render.com
- Regístrate con GitHub (más fácil)

### 2️⃣ CREAR WEB SERVICE
1. Click "New +" → "Web Service"
2. Conecta tu repositorio GitHub: `FabianPalacios2512/marketplace`
3. Configuración:
   - **Name:** `uni-eats-marketplace`
   - **Environment:** `Docker`
   - **Region:** `Oregon (us-west1)` (más cerca de Colombia)
   - **Branch:** `main`
   - **Dockerfile Path:** `./Dockerfile` (automático)

### 3️⃣ VARIABLES DE ENTORNO
Agrega estas variables en Render:

```
DATABASE_URL=jdbc:postgresql://unieatsdb.ckp2uo6uawjd.us-east-1.rds.amazonaws.com:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=F1001504182.a
SPRING_MAIL_USERNAME=tu_email@gmail.com
SPRING_MAIL_PASSWORD=tu_app_password_gmail
```

> 📧 **IMPORTANTE GMAIL:**
> - Para `SPRING_MAIL_PASSWORD` NO uses tu contraseña normal
> - Usa una "App Password" de Gmail (más seguro)
> - Ve a: Google Account → Security → 2-Step Verification → App passwords
> - Genera una contraseña específica para esta app

### 4️⃣ CONFIGURACIÓN AVANZADA
- **Plan:** `Free` (para empezar)
- **Auto-Deploy:** `Yes` (deploy automático con cada push)
- **Build Command:** (Automático con Docker)
- **Start Command:** (Automático con Docker)

### 5️⃣ DEPLOY
1. Click "Create Web Service"
2. ⏰ Esperar 5-10 minutos (primera vez)
3. 🎉 Render te dará una URL con HTTPS automático

## ✅ VERIFICACIÓN POST-DEPLOY

### 🔍 Testing Checklist:
- [ ] Página de login carga correctamente
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Dashboard de estudiante/vendedor carga
- [ ] 🔔 **PUSH NOTIFICATIONS** - Permisos se solicitan automáticamente
- [ ] Subir productos funciona
- [ ] Sistema de pedidos funciona

### 🚨 Si algo falla:
1. Check logs en Render Dashboard
2. Verificar variables de entorno
3. Confirmar que RDS permite conexiones desde internet

## 🎯 URLS IMPORTANTES

Una vez deployado tendrás:
- **App URL:** `https://uni-eats-marketplace.onrender.com`
- **HTTPS Automático:** ✅ (push notifications funcionarán)
- **Custom Domain:** Opcional después

## 📱 TESTING PUSH NOTIFICATIONS

Con HTTPS automático de Render:
1. Abre la app en móvil
2. Ve a "Mis Pedidos"
3. Acepta permisos de notificaciones
4. Haz un pedido desde otro dispositivo
5. 🔔 Deberías recibir notificación instantánea

## 💡 TIPS PRO

- **Logs en tiempo real:** Render Dashboard → Service → Logs
- **Redeploy manual:** Si necesitas, click "Manual Deploy"
- **Monitoreo:** Render te avisa si la app se cae
- **Scaling:** Fácil upgrade a plan paid si necesitas

## 🔥 VENTAJAS VS NGROK

| Feature | ngrok | Render |
|---------|-------|--------|
| HTTPS | ✅ | ✅ |
| Permanente | ❌ | ✅ |
| Push Notifications | ✅ | ✅ |
| Custom Domain | ❌ | ✅ |
| Uptime 24/7 | ❌ | ✅ |
| Costo | $5/mes | GRATIS |

¡Tu marketplace será accesible 24/7 con HTTPS real! 🚀