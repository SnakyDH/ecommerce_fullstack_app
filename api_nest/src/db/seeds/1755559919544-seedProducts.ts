import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProducts1755559919544 implements MigrationInterface {
  name = 'SeedProducts1755559919544'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "products" ("name", "image", "price", "stock") VALUES 
            ('Premium Coffee Beans - Colombian', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 2499, 150),
            ('Espresso Machine Deluxe', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 45999, 25),
            ('French Press Coffee Maker', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', 3999, 80),
            ('Organic Ethiopian Coffee', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', 2899, 120),
            ('Coffee Grinder Pro', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=400&fit=crop', 12999, 45),
            ('Ceramic Coffee Mug Set', 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 1999, 200),
            ('Cold Brew Coffee Concentrate', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 1599, 90),
            ('Milk Frother Electric', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 4999, 60),
            ('Coffee Filter Papers (100pk)', 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&h=400&fit=crop', 899, 300),
            ('Decaf House Blend', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 2199, 100),
            ('Cappuccino Maker', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 29999, 35),
            ('Travel Coffee Tumbler', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 2499, 150),
            ('Dark Roast Arabica Beans', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', 2699, 130),
            ('Pour Over Coffee Dripper', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', 2999, 70),
            ('Coffee Scale Digital', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=400&fit=crop', 5999, 40),
            ('Vanilla Flavored Coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 2399, 110),
            ('Coffee Bean Storage Container', 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop', 1799, 85),
            ('Iced Coffee Maker', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 8999, 30),
            ('Coffee Syrup Variety Pack', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 3499, 65),
            ('Single Origin Guatemala', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop', 3199, 95),
            ('Coffee Cleaning Tablets', 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&h=400&fit=crop', 1299, 180),
            ('Portable Espresso Maker', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 7999, 50),
            ('Coffee Subscription Box', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 4999, 25),
            ('Bamboo Coffee Filter Holder', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', 1499, 120),
            ('Coffee Roasting Kit', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400&h=400&fit=crop', 15999, 20)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "products" WHERE "name" IN (
            'Premium Coffee Beans - Colombian',
            'Espresso Machine Deluxe',
            'French Press Coffee Maker',
            'Organic Ethiopian Coffee',
            'Coffee Grinder Pro',
            'Ceramic Coffee Mug Set',
            'Cold Brew Coffee Concentrate',
            'Milk Frother Electric',
            'Coffee Filter Papers (100pk)',
            'Decaf House Blend',
            'Cappuccino Maker',
            'Travel Coffee Tumbler',
            'Dark Roast Arabica Beans',
            'Pour Over Coffee Dripper',
            'Coffee Scale Digital',
            'Vanilla Flavored Coffee',
            'Coffee Bean Storage Container',
            'Iced Coffee Maker',
            'Coffee Syrup Variety Pack',
            'Single Origin Guatemala',
            'Coffee Cleaning Tablets',
            'Portable Espresso Maker',
            'Coffee Subscription Box',
            'Bamboo Coffee Filter Holder',
            'Coffee Roasting Kit'
        )`);
  }
}
