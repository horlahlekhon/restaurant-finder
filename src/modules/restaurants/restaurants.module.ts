import { Module } from '@nestjs/common';
import { RestaurantsRepository } from './repositories/restaurantRepository';
import { RestaurantsService } from './services/restaurants.service';
import { RestaurantsController } from './controllers/restaurants.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RestaurantsRepository, RestaurantsService],
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}
