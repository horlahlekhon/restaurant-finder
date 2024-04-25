import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from '../src/modules/restaurants/controllers/restaurants.controller';
import { RestaurantsService } from '../src/modules/restaurants/services/restaurants.service';
import { RestaurantsDtos } from '../src/modules/restaurants/dtos/restaurantsDtos';
import { v4 as uuidv4 } from 'uuid';

describe('RestaurantController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [RestaurantsService],
    }).compile();
    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
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
  });
});
