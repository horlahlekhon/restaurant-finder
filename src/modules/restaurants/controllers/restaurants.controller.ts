import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from '../services/restaurants.service';
import {
  RestaurantsDtos,
  PatchRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurantsDtos';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('')
  async getAllRestaurants(@Query() filter: RestaurantFilterDto) {
    return this.restaurantsService.getAll(filter);
  }

  @Post('')
  async createRestaurant(@Body() body: RestaurantsDtos) {
    return this.restaurantsService.create(body);
  }

  @Delete(':id')
  async deleteRestaurant(@Param('id') id: string) {
    return await this.restaurantsService.delete(id);
  }

  @Put(':id')
  async updateRestaurant(
    @Body() body: RestaurantsDtos,
    @Param('id') id: string,
  ) {
    return this.restaurantsService.update(id, body);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string) {
   return await this.restaurantsService.get(id);

  }

  @Patch(':id')
  async patchRestaurant(
    @Body() body: PatchRestaurantDto,
    @Param('id') id: string,
  ) {
    return this.restaurantsService.patch(id, body);
  }
}
