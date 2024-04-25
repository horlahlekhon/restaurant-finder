import { PrismaService } from '../../prisma/prisma.service';
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
import { calculateMinMaxCoordinates } from '../../common/helpers/distanceHelpers';
// import { response } from 'express';

@Injectable()
export class RestaurantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRestaurants(filter: RestaurantFilterDto) {
    const { minLatitude, maxLatitude, minLongitude, maxLongitude } =
      calculateMinMaxCoordinates(
        {
          centreLat: Number(filter.latitude),
          centreLon: Number(filter.longitude),
        },
        Number(filter.distance),
      );
    if (
      isNaN(minLongitude) ||
      isNaN(maxLongitude) ||
      isNaN(minLatitude) ||
      isNaN(minLatitude)
    ) {
      throw new HttpException('Restaurants not found', HttpStatus.NOT_FOUND);
    }
    return await this.prisma.restaurants.findMany({
      where: {
        AND: [
          { latitude: { gte: minLatitude } },
          { latitude: { lte: maxLatitude } },
          { longitude: { gte: minLongitude } },
          { longitude: { lte: maxLongitude } },
          { city: { equals: filter.city } },
        ],
      },
    });
  }

  async getOneRestaurant(id) {
    return await this.prisma.restaurants.findUnique({ where: { id: id } });
  }

  async create(body: RestaurantsDtos) {
    try {
      const id = uuidv4();
      return await this.prisma.restaurants.create({
        data: {
          ...body,
          id,
        },
      });
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
