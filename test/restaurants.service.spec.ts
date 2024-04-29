import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { RestaurantsDtos } from '../src/modules/restaurants/dtos/restaurantsDtos';
import { RestaurantsService } from '../src/modules/restaurants/services/restaurants.service';
import { RestaurantsRepository } from '../src/modules/restaurants/repositories/restaurantRepository';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { calculateDistance } from '../src/modules/common/helpers/distanceHelpers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../src/modules/config/app.config';
import Joi from 'joi';

const prisma = new PrismaClient();
const configService = new ConfigService();
beforeAll(async () => {

  await prisma.$connect();
  await prisma.restaurants.createMany({
    data: [
      {
        id: uuidv4(),
        createdAt: new Date(),
        name: 'The place',
        city: 'Lekki',
        address: 'Circle mall, Osapa london, Osapa, lagos.',
        latitude: 6.438529011071922,
        longitude: 3.5079578998278924,
      },
      {
        id: uuidv4(),
        createdAt: new Date(),
        name: 'Chicken republic, Agungi',
        city: 'Lekki',
        address: '23, Agungi Ajiran road, Agungi bustop, Lekki, Lagos',
        latitude: 6.442579865978835,
        longitude: 3.515942647755498,
      },
      {
        id: uuidv4(),
        createdAt: new Date(),
        name: 'Some unknown mama put, Agungi',
        city: 'Lekki',
        address: '23, Agungi Ajiran road, Agungi bustop, Lekki, Lagos',
        latitude: 6.448250413398417,
        longitude: 3.5149520714207765,
      },
      {
        id: uuidv4(),
        createdAt: new Date(),
        name: 'Some unknown mama put within distance but in a different city, Agungi',
        city: 'Agungi',
        address: '23, Agungi Ajiran road, Agungi bustop, Lekki, Lagos',
        latitude: 6.448069177012541,
        longitude: 3.5121625741417524,
      },
    ],
  });
});

afterAll(async () => {
  await prisma.restaurants.deleteMany();
  await prisma.$disconnect();
});
describe('RestaurantService', () => {
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        RestaurantsRepository,
        PrismaService,
        RestaurantsService,
        ConfigService,
      ],
    }).compile();
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new restaurant', async () => {
      const createRestaurantDto: RestaurantsDtos = {
        name: 'Everest',
        address: '2 Longitude Avenue, latitude junction, Earth',
        city: 'Latitude',
        latitude: 6.452024379885318,
        longitude: 3.513922103194676,
      };
      const restaurant = await service.create(createRestaurantDto);
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name', createRestaurantDto.name);
      expect(restaurant).toHaveProperty('address', createRestaurantDto.address);
      expect(restaurant).toHaveProperty('city', createRestaurantDto.city);
      expect(restaurant).toHaveProperty(
        'latitude',
        createRestaurantDto.latitude,
      );
      expect(restaurant).toHaveProperty(
        'longitude',
        createRestaurantDto.longitude,
      );
    });

    it('Should Return Conflict error when existing data coordinates is passed to create restaurant', async () => {
      const createRestaurantDto: RestaurantsDtos = {
        name: 'Everest',
        address: '2 Longitude Avenue, latitude junction, Earth',
        city: 'Latitude',
        latitude: 4.45588139232297,
        longitude: 3.54553775318852,
      };
      const restaurant = await service.create(createRestaurantDto);
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name', createRestaurantDto.name);
      expect(restaurant).toHaveProperty('address', createRestaurantDto.address);
      expect(restaurant).toHaveProperty('city', createRestaurantDto.city);
      expect(restaurant).toHaveProperty(
        'latitude',
        createRestaurantDto.latitude,
      );
      expect(restaurant).toHaveProperty(
        'longitude',
        createRestaurantDto.longitude,
      );
      try {
        await service.create(createRestaurantDto);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('Restaurant already exist');
      }
    });
  });

  describe('getAll', () => {
    it('Should get all restaurant that meet the filter criteria', async () => {
      const filter = {
        city: 'Lekki',
        latitude: 6.447045723264547,
        longitude: 3.5142654259367094,
        distance: 1000,
      };
      const restaurants = await service.getAll(filter);
      expect(restaurants).toBeDefined();
      expect(restaurants).toHaveLength(3);
      for (const restaurant of restaurants) {
        console.log(restaurant);
        const centre = {
          lat1: filter.latitude,
          lon1: filter.longitude,
        };
        const restaurantPoint = {
          lat2: restaurant.latitude,
          lon2: restaurant.longitude,
        };
        const distanceBtw = calculateDistance(centre, restaurantPoint);
        expect(distanceBtw).toBeLessThanOrEqual(filter.distance);
      }
    });
  });
});
