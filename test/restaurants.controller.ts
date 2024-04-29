import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from '../src/modules/restaurants/controllers/restaurants.controller';
import { RestaurantsService } from '../src/modules/restaurants/services/restaurants.service';
import { RestaurantsDtos } from '../src/modules/restaurants/dtos/restaurantsDtos';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantsRepository } from '../src/modules/restaurants/repositories/restaurantRepository';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('RestaurantController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        RestaurantsService,
        RestaurantsRepository,
        PrismaService,
        ConfigService,
      ],
    }).compile();
    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRestaurant', () => {
    it('should create a restaurant', async () => {
      const createRestaurantDto: RestaurantsDtos = {
        name: 'Everest',
        address: '2 Longitude Avenue, latitude junction, Earth',
        city: 'Latitude',
        latitude: 6.455881392229708,
        longitude: 3.545537771885267,
      };
      const createdRestaurant = {
        id: uuidv4(),
        createdAt: new Date(),
        ...createRestaurantDto,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdRestaurant);

      expect(await controller.createRestaurant(createRestaurantDto)).toBe(
        createdRestaurant,
      );
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });

    it('should return bad request when invalid coordinates is passed to create a restaurant', async () => {
      const createRestaurantDto: RestaurantsDtos = {
        name: 'Everest',
        address: '2 Longitude Avenue, latitude junction, Earth',
        city: 'Latitude',
        latitude: 200.4558813,
        longitude: 300.545537,
      };
      const createdRestaurantError = {
        message: [
          'latitude must not be greater than 90',
          'longitude must not be greater than 180',
        ],
        error: 'Bad Request',
        statusCode: 400,
      };
      // @ts-expect-error the result type of the create didnt define a union for error
      jest.spyOn(service, 'create').mockResolvedValue(createdRestaurantError);

      expect(await controller.createRestaurant(createRestaurantDto)).toBe(
        createdRestaurantError,
      );
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });
  });

  describe('getAllRestaurants', () => {
    it('Should get all restaurants meeting the provided filter criteria', async () => {
      const restaurants = [
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
      ];
      const filter = {
        city: 'lekki',
        latitude: 6.442579865978835,
        longitude: 3.515942647755498,
        distance: 1000,
      };
      jest.spyOn(service, 'getAll').mockResolvedValue(restaurants);

      expect(await controller.getAllRestaurants(filter)).toBe(restaurants);
      expect(service.getAll).toHaveBeenCalledWith(filter);
    });

    it('Should return 400 error when filter is not provided ', async () => {
      const error = {
        message: [
          'city must be a string',
          'city should not be empty',
          'latitude must be a latitude string or number',
          'latitude should not be empty',
          'longitude must be a longitude string or number',
          'longitude should not be empty',
          'distance is not a valid decimal number.',
          'distance should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      };
      const filter = {};
      // @ts-expect-error the result type of the getAll didnt define a union for error
      jest.spyOn(service, 'getAll').mockResolvedValue(error);

      // @ts-expect-error the result type of the getAll didnt define a union for error
      expect(await controller.getAllRestaurants(filter)).toBe(error);
      expect(service.getAll).toHaveBeenCalledWith(filter);
    });

    it('Should return 400 error when invalid value iis provided for the filter ', async () => {
      const error = {
        message: [
          'latitude must be a latitude string or number',
          'longitude must be a longitude string or number',
        ],
        error: 'Bad Request',
        statusCode: 400,
      };
      const filter = {
        city: 'lekki',
        latitude: 200.442579865978835,
        longitude: 200.515942647755498,
        distance: 1000,
      };
      // @ts-expect-error the result type of the getAll didnt define a union for error
      jest.spyOn(service, 'getAll').mockResolvedValue(error);

      expect(await controller.getAllRestaurants(filter)).toBe(error);
      expect(service.getAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getRestaurant', () => {
    it('Should get a single restaurant when a valid ID is passed', async () => {
      const restaurant = {
        id: uuidv4(),
        createdAt: new Date(),
        name: 'The place',
        city: 'Lekki',
        address: 'Circle mall, Osapa london, Osapa, lagos.',
        latitude: 6.438529011071922,
        longitude: 3.5079578998278924,
      };

      jest.spyOn(service, 'get').mockResolvedValue(restaurant);

      expect(await controller.getRestaurant(restaurant.id)).toBe(restaurant);
      expect(service.get).toHaveBeenCalledWith(restaurant.id);
    });

    it('Should Return Not found when an invalid id was passed', async () => {
      const error = {
        message: 'Restaurant not found',
      };
      const id = uuidv4();
      // @ts-expect-error the result type of the getAll didnt define a union for error
      jest.spyOn(service, 'get').mockResolvedValue(error);

      expect(await controller.getRestaurant(id)).toBe(error);
      expect(service.get).toHaveBeenCalledWith(id);
    });
  });
});
