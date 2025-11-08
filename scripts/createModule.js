#!/usr/bin/env node
/**
 * 🚀 Script para crear un módulo DDD completo (NestJS + Sequelize)
 * + Actualiza automáticamente el README.md global
 */

const fs = require("fs");
const path = require("path");

// ------------------------------------
// 📦 Punto de entrada
// ------------------------------------
(function main() {
  const [, , baseDir, moduleName] = process.argv;

  if (!baseDir || !moduleName) {
    console.error("❌ Uso: node createModule.js <directorioBase> <nombreModulo>");
    process.exit(1);
  }

  createModule(baseDir, moduleName);
})();

// ------------------------------------
// 🏗️ Función principal
// ------------------------------------
function createModule(baseDir, moduleName) {
  const modulePath = path.join(baseDir, moduleName);

  const folders = [
    "domain/entities",
    "domain/repositories",
    "domain/services",
    "application/services",
    "infrastructure/persistence/models",
    "infrastructure/persistence/repositories",
  ];

  folders.forEach((folder) => {
    const dir = path.join(modulePath, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log(`✅ Estructura DDD creada: ${modulePath}`);

  // Crear archivos por capa
  createDomainEntity(modulePath, moduleName);
  createDomainRepository(modulePath, moduleName);
  createDomainService(modulePath, moduleName);
  createDomainIndex(modulePath, moduleName);

  createSequelizeModel(modulePath, moduleName);
  createRepositoryImpl(modulePath, moduleName);
  createInfrastructureIndex(modulePath, moduleName);

  createApplicationService(modulePath, moduleName);
  createApplicationIndex(modulePath, moduleName);

  createModuleFile(modulePath, moduleName);

  // 📝 Actualizar el README.md
  updateReadme(moduleName);
}

// ------------------------------------
// 🧠 Dominio
// ------------------------------------
function createDomainEntity(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "domain/entities", `${moduleName}.entity.ts`);

  const content = `
import { randomUUID } from 'crypto';

/**
 * Entidad de dominio: ${className}
 */
export class ${className} {
  readonly id: string;
  name: string;
  email: string;
  readonly createdAt: Date;

  constructor(props: { id?: string; name: string; email: string; createdAt?: Date }) {
    const { id, name, email, createdAt } = props;
    if (!name?.trim()) throw new Error('Name cannot be empty');
    if (!email.includes('@')) throw new Error('Invalid email');
    this.id = id ?? randomUUID();
    this.name = name.trim();
    this.email = email.trim();
    this.createdAt = createdAt ?? new Date();
  }

  static create(name: string, email: string): ${className} {
    return new ${className}({ name, email, createdAt: new Date() });
  }

  updateName(newName: string) {
    if (!newName?.trim()) throw new Error('Invalid name');
    this.name = newName.trim();
  }

  toPrimitives() {
    return { id: this.id, name: this.name, email: this.email, createdAt: this.createdAt };
  }
}
`.trimStart();

  write(file, content, "Dominio → Entidad");
}

function createDomainRepository(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "domain/repositories", `${moduleName}.repository.ts`);

  const content = `
import { ${className} } from '../entities/${moduleName}.entity';

export abstract class ${className}Repository {
  abstract create(entity: ${className}): Promise<${className}>;
  abstract findDomainById(id: string): Promise<${className} | null>;
  abstract findDomainAll(): Promise<${className}[]>;
}
`.trimStart();

  write(file, content, "Dominio → Repositorio");
}

function createDomainService(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "domain/services", `${moduleName}.domain.service.ts`);

  const content = `
import { Injectable } from '@nestjs/common';
import { ${className}Repository } from '../repositories/${moduleName}.repository';
import { ${className} } from '../entities/${moduleName}.entity';

/**
 * Servicio de dominio para ${className}
 */
@Injectable()
export class ${className}DomainService {
  constructor(private readonly repository: ${className}Repository) {}

  async findById(id: string): Promise<${className} | null> {
    return this.repository.findDomainById(id);
  }

  async createEntity(name: string, email: string): Promise<${className}> {
    const entity = ${className}.create(name, email);
    return this.repository.create(entity);
  }
}
`.trimStart();

  write(file, content, "Dominio → Servicio");
}

function createDomainIndex(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "domain", "index.ts");

  const content = `
import { ${className}DomainService } from './services/${moduleName}.domain.service';
export { ${className}DomainService };

export const DOMAIN_SERVICES = [${className}DomainService];
`.trimStart();

  write(file, content, "Dominio → Index");
}

// ------------------------------------
// ⚙️ Infraestructura
// ------------------------------------
function createSequelizeModel(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "infrastructure/persistence/models", `${moduleName}.model.ts`);

  const content = `
import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: '${moduleName}s', timestamps: true })
export class ${className}Model extends Model<${className}Model> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;
}
`.trimStart();

  write(file, content, "Infraestructura → Modelo");
}

function createRepositoryImpl(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "infrastructure/persistence/repositories", `${moduleName}.repository.impl.ts`);

  const content = `
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { MysqlRepositoryImpl } from '@bdd-backend/common/dist/infrastructure/repositories/mysql.repository.impl';
import { ${className}Model } from '../models/${moduleName}.model';
import { ${className}Repository } from '@/context/${moduleName}/domain/repositories/${moduleName}.repository';
import { ${className} } from '@/context/${moduleName}/domain/entities/${moduleName}.entity';

@Injectable()
export class ${className}RepositoryImpl
  extends MysqlRepositoryImpl<${className}Model>
  implements ${className}Repository
{
  constructor(sequelize: Sequelize) {
    super(sequelize, ${className}Model);
  }

  async create(entity: ${className}): Promise<${className}> {
    const record = await super.save(entity);
    return new ${className}(record.dataValues);
  }

  async findDomainById(id: string): Promise<${className} | null> {
    const record = await super.findById(id);
    return record ? new ${className}(record.dataValues) : null;
  }

  async findDomainAll(): Promise<${className}[]> {
    const records = await super.findAll();
    return records.map(r => new ${className}(r.dataValues));
  }
}
`.trimStart();

  write(file, content, "Infraestructura → Repositorio");
}

function createInfrastructureIndex(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "infrastructure", "index.ts");

  const content = `
import { Sequelize } from 'sequelize-typescript';
import { ${className}RepositoryImpl } from './persistence/repositories/${moduleName}.repository.impl';
import { ${className}Repository } from '@/context/${moduleName}/domain/repositories/${moduleName}.repository';

export const ${className}Provider = {
  provide: ${className}Repository,
  useFactory: async (sequelize: Sequelize) => new ${className}RepositoryImpl(sequelize),
  inject: ['Sequelize'],
};

export const PROVIDERS = [${className}Provider];
`.trimStart();

  write(file, content, "Infraestructura → Index");
}

// ------------------------------------
// 💼 Aplicación
// ------------------------------------
function createApplicationService(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "application/services", `${moduleName}.service.ts`);

  const content = `
import { Injectable } from '@nestjs/common';
import { ${className}Repository } from '@/context/${moduleName}/domain/repositories/${moduleName}.repository';
import { ${className} } from '@/context/${moduleName}/domain/entities/${moduleName}.entity';

@Injectable()
export class ${className}Service {
  constructor(private readonly repository: ${className}Repository) {}

  async all(): Promise<${className}[]> {
    return this.repository.findDomainAll();
  }

  async create(data: Partial<${className}>): Promise<${className}> {
    const entity = ${className}.create(data.name!, data.email!);
    return this.repository.create(entity);
  }
}
`.trimStart();

  write(file, content, "Aplicación → Servicio");
}

function createApplicationIndex(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, "application", "index.ts");

  const content = `
import { ${className}Service } from '@/context/${moduleName}/application/services/${moduleName}.service';
export { ${className}Service };

export const APPLICATION_SERVICES = [${className}Service];
`.trimStart();

  write(file, content, "Aplicación → Index");
}

// ------------------------------------
// 🧩 Módulo principal NestJS
// ------------------------------------
function createModuleFile(modulePath, moduleName) {
  const className = capitalize(moduleName);
  const file = path.join(modulePath, `${moduleName}.module.ts`);

  const content = `
import { Module } from '@nestjs/common';
import { PROVIDERS } from '@/context/${moduleName}/infrastructure';
import { APPLICATION_SERVICES } from '@/context/${moduleName}/application';
import { DOMAIN_SERVICES } from '@/context/${moduleName}/domain';

@Module({
  providers: [...APPLICATION_SERVICES, ...PROVIDERS, ...DOMAIN_SERVICES],
  exports: [...APPLICATION_SERVICES, ...PROVIDERS, ...DOMAIN_SERVICES],
})
export class ${className}Module {}
`.trimStart();

  write(file, content, "Módulo principal");
}

// ------------------------------------
// 🔤 Utilidades
// ------------------------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function write(filePath, content, label) {
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${label} creado: ${filePath}`);
}

// ------------------------------------
// 🧾 Actualizar README.md global
// ------------------------------------
function updateReadme(moduleName) {
  const readmeDir = path.join("app", "src");
  const readmePath = path.join(readmeDir, "README.md");
  const title = capitalize(moduleName);

  // Crear la carpeta si no existe
  if (!fs.existsSync(readmeDir)) {
    fs.mkdirSync(readmeDir, { recursive: true });
  }

  let content = "";

  // Si no existe el archivo, creamos uno base
  if (!fs.existsSync(readmePath)) {
    content = `# 📚 Documentación de Módulos\n\n`;
  } else {
    content = fs.readFileSync(readmePath, "utf8");
  }

  const moduleEntry = `- [${title}](./context/${moduleName})`;

  // Evitar duplicados
  if (!content.includes(moduleEntry)) {
    content += `\n${moduleEntry}`;
    fs.writeFileSync(readmePath, content);
    console.log(`📝 README.md actualizado con el módulo: ${title}`);
  } else {
    console.log(`ℹ️ El módulo ${title} ya está listado en el README.md`);
  }
}

