import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantsRepository } from '../repositories/restaurantRepository';
import {
  RestaurantsDtos,
  PatchRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurantsDtos';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  async getAll(filter: RestaurantFilterDto) {
    const res = await this.restaurantsRepository.getAllRestaurants(filter);
    console.log(res);
    return res;
  }

  async create(body: RestaurantsDtos) {
    try {
      return this.restaurantsRepository.create(body);
    } catch (e) {
      throw new HttpException('Restaurant already exist', HttpStatus.CONFLICT);
    }
  }

  async get(id: string) {
    const restaurant = await this.restaurantsRepository.getOneRestaurant(id);
    if (!restaurant) {
      throw new HttpException('Restaurants not found', HttpStatus.NOT_FOUND);
    } else {
      return restaurant;
    }
  }

  async delete(id: string) {
    return this.restaurantsRepository.delete(id);
  }

  async update(id: string, body: RestaurantsDtos) {
    return await this.restaurantsRepository.update(id, body);
  }

  async patch(id: string, body: PatchRestaurantDto) {
    return await this.restaurantsRepository.patch(id, body);
  }
}
