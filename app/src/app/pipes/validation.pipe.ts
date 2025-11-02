import { ArgumentMetadata, BadRequestException, PipeTransform, ValidationPipe } from '@nestjs/common'

export class GlobalValidationPipe extends ValidationPipe {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && typeof value === 'string') {
      throw new BadRequestException('❌ Datos inválidos.')
    }
    return super.transform(value, metadata)
  }
}
