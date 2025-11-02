# 📘 `createModule.js` — Generador de módulos DDD (NestJS + Sequelize)

Este script crea automáticamente una **estructura modular basada en Domain-Driven Design (DDD)** para proyectos **NestJS**, lista para trabajar con **Sequelize ORM**.

Cada módulo generado incluye las carpetas de **Domain**, **Application** e **Infrastructure**, junto con sus entidades, repositorios, servicios y módulos configurados.

---

## 🧩 Estructura generada

Ejemplo al ejecutar:

```bash
node createModule.js src/context user
```

Se creará la siguiente estructura:

```
src/
└── context/
    └── user/
        ├── domain/
        │   ├── entities/
        │   │   └── user.entity.ts
        │   ├── repositories/
        │   │   └── user.repository.ts
        │   ├── services/
        │   │   └── user.domain.service.ts
        │   └── index.ts
        ├── application/
        │   ├── services/
        │   │   └── user.service.ts
        │   └── index.ts
        ├── infrastructure/
        │   ├── persistence/
        │   │   ├── models/
        │   │   │   └── user.model.ts
        │   │   └── repositories/
        │   │       └── user.repository.impl.ts
        │   └── index.ts
        └── user.module.ts
```

---

## ⚙️ Instalación

Copia el archivo `createModule.js` en la raíz de tu proyecto (por ejemplo en `/scripts` o `/tools`):

```
scripts/
└── createModule.js
```

Asegúrate de tener Node.js 18+ instalado.

Luego dale permisos de ejecución (opcional en Linux/macOS):

```bash
chmod +x scripts/createModule.js
```

---

## 🚀 Uso

Ejecuta el script con:

```bash
node scripts/createModule.js <directorioBase> <nombreModulo>
```

### Ejemplo:

```bash
node scripts/createModule.js src/context user
```

📁 Esto creará todo el módulo `user` dentro de `src/context`.

---

## 🧠 Parámetros

| Parámetro          | Requerido | Descripción                                                                 |
|--------------------|------------|------------------------------------------------------------------------------|
| `<directorioBase>` | ✅ | Carpeta base donde se generará el módulo (por ejemplo `src/context`). |
| `<nombreModulo>`   | ✅ | Nombre del módulo (minúsculas, sin espacios). Ejemplo: `user`, `vehicle`, `brand`. |

---

## 🧱 Archivos generados

### **Dominio (`/domain`)**
- `entities/<module>.entity.ts` → Entidad de dominio principal (con validaciones y métodos de fábrica).
- `repositories/<module>.repository.ts` → Abstracción del repositorio.
- `services/<module>.domain.service.ts` → Lógica de negocio pura.
- `index.ts` → Exporta los servicios del dominio.

### **Aplicación (`/application`)**
- `services/<module>.service.ts` → Lógica de aplicación (usa entidades y repositorios).
- `index.ts` → Exporta servicios para el módulo principal.

### **Infraestructura (`/infrastructure`)**
- `persistence/models/<module>.model.ts` → Modelo Sequelize.
- `persistence/repositories/<module>.repository.impl.ts` → Implementación del repositorio de dominio.
- `index.ts` → Contenedor de providers NestJS.

### **Módulo principal**
- `<module>.module.ts` → Ensambla las capas `domain`, `application` e `infrastructure` para NestJS.

---

## 🧩 Integración en NestJS

Una vez generado el módulo, puedes importarlo directamente en tu `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { UserModule } from '@/context/user/user.module';
import { VehicleModule } from '@/context/vehicle/vehicle.module';

@Module({
  imports: [UserModule, VehicleModule],
})
export class AppModule {}
```

---

## 🧪 Ejemplo completo

```bash
node scripts/createModule.js src/context vehicle
```

📂 Resultado:

```
src/context/vehicle/
├── domain/
│   ├── entities/vehicle.entity.ts
│   ├── repositories/vehicle.repository.ts
│   ├── services/vehicle.domain.service.ts
│   └── index.ts
├── application/
│   ├── services/vehicle.service.ts
│   └── index.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── models/vehicle.model.ts
│   │   └── repositories/vehicle.repository.impl.ts
│   └── index.ts
└── vehicle.module.ts
```

---

## ⚡ Ejecución desde `package.json`

Agrega un comando para simplificar su uso:

```json
{
  "scripts": {
    "generate:module": "node scripts/createModule.js"
  }
}
```

Ejemplo:

```bash
pnpm generate:module src/context user
```

---

## 📄 Licencia

MIT © 2025 — Desarrollado para arquitecturas modulares con **NestJS + Sequelize + DDD**.
