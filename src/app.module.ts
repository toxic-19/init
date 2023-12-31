import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      // 导入数据库配置
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'order',
      models: [User], // 实体模型注册，让Squelize知道存在
    }),
    UserModule,
    CategoryModule,
  ], // 导入模块到AppModule里面，避免所有的Controller和Service都在AppModule里面导致太杂乱
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 配置中间件时将包含路由路径的对象和请求方法传递给forRoutes()方法
    consumer
      .apply(LoggerMiddleware) // 也可以指定多个中间件
      .exclude(
        // 需要排除的路由
        { path: 'user', method: RequestMethod.GET },
        { path: 'user', method: RequestMethod.POST },
        'user/(.*)',
      )
      // .forRoutes({ path: 'user', method: RequestMethod.GET }); // 如果只是路由路径就不需要对象形式 path还支持路由匹配
      .forRoutes(AppController); // 当然也可以接受一个或多个控制器
  }
}
