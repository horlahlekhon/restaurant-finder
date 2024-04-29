import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  RestaurantsDtos,
  PatchRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurantsDtos';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

@Injectable()
export class RestaurantsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getAllRestaurants(filter: RestaurantFilterDto) {
    const redis = new Redis();
    try {
      const restaurantRedis = await redis.georadius(
        'restaurants',
        filter.longitude,
        filter.latitude,
        filter.distance,
        'm',
      );
      console.log('redis', restaurantRedis);
      if (restaurantRedis.length === 0) {
        throw new HttpException('No restaurants found', HttpStatus.NOT_FOUND);
      }
      const dbRestaurants = await this.prisma.restaurants.findMany({
        where: {
          AND: [
            { id: { in: restaurantRedis as string[] } },
            { city: { equals: filter.city } },
          ],
        },
      });
      console.log('db', dbRestaurants);
      return dbRestaurants;
    } finally {
      redis.quit();
    }
  }

  async getOneRestaurant(id) {
    return await this.prisma.restaurants.findUnique({ where: { id: id } });
  }

  async create(body: RestaurantsDtos) {
    try {
      const id = uuidv4();
      const restaurant = await this.prisma.restaurants.create({
        data: {
          ...body,
          id,
        },
      });
      const redis = new Redis();
      redis.geoadd(
        'restaurants',
        restaurant.longitude,
        restaurant.latitude,
        restaurant.id,
      );
      return restaurant;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException({
          statusCode: 409,
          message: 'Restaurant already exist',
        });
      }
      throw e;
    }
  }

  async delete(id) {
    try {
      return await this.prisma.restaurants.delete(id);
    } catch (e) {
      return null;
    }
  }

  async update(id: string, data: RestaurantsDtos) {
    try {
      return await this.prisma.restaurants.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      return null;
    }
  }

  async patch(id: string, data: PatchRestaurantDto) {
    try {
      return await this.prisma.restaurants.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      return null;
    }
  }
}
