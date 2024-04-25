import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { RestaurantsDtos } from '../src/modules/restaurants/dtos/restaurantsDtos';
import { RestaurantsService } from '../src/modules/restaurants/services/restaurants.service';
import { RestaurantsRepository } from '../src/modules/restaurants/repositories/restaurantRepository';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
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
      // imports: [RestaurantsService],
      controllers: [],
      providers: [RestaurantsRepository, PrismaService, RestaurantsService],
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
        latitude: 4.455881392229708,
        longitude: 3.545537771885267,
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
  });
});
