import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

// Obtener el nombre del módulo de los argumentos
const moduleName = process.argv[2]
if (!moduleName) {
  console.error('Por favor, proporciona el nombre del módulo.')
  process.exit(1)
}

// Variable que contiene el nombre del módulo
const contextPath = 'context'

// Construir el comando
const command = `nest g module ${contextPath}/${moduleName}`

const createDirectory = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    console.log(`Directorio '${dirPath}' creado.`)
  } else {
    console.log(`El directorio '${dirPath}' ya existe.`)
  }
}

// Estructura DDD básica
const baseDir = './src'
const dddFolders = [
  'domain/entities',
  'domain/repositories',
  'application/use-cases',
  'application/services',
  'infrastructure/persistence',
]

dddFolders.forEach((folder) => {
  createDirectory(join(baseDir, folder))
})

// Ejecutar el comando
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error ejecutando el comando: ${error.message}`)
    return;
  }
  if (stderr) {
    console.error(`Error en la ejecución: ${stderr}`)
    return
  }
  console.log(`Resultado: ${stdout}`)
})
