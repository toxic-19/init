import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { logger } from './common/logger/logger.middleware';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 在main.ts中注册全局中间件,只能是函数中间件
  app.use(logger);
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局使用异常处理器 比如不存在的路径
  const config = new DocumentBuilder() // swagger文档相关配置 在category模块进行配置参考
    .setTitle('InitNest swagger')
    .setDescription('The initNest API description')
    .setVersion('1.0')
    .addTag('toxic-19')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 定义并初始化SwaggerModule类: 在localhost:3001/api 就可以看到Swagger文档
  await app.listen(3001, () => {
    Logger.log('node服务器已启动');
  });
}
bootstrap();
