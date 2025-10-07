import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ServicePackageController } from 'src/service-package/service-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';

@Module({
  controllers: [ServicePackageController, BlogController],
  providers: [BlogService],
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
})
export class BlogModule {}
