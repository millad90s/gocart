const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { id: 'user_1' },
      update: {},
      create: {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        cart: {},
      },
    }),
    prisma.user.upsert({
      where: { id: 'user_2' },
      update: {},
      create: {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        cart: {},
      },
    }),
    prisma.user.upsert({
      where: { id: 'user_3' },
      update: {},
      create: {
        id: 'user_3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        cart: {},
      },
    }),
  ])

  console.log('✅ Created users')

  // Create sample stores
  const stores = await Promise.all([
    prisma.store.upsert({
      where: { userId: 'user_1' },
      update: {},
      create: {
        userId: 'user_1',
        name: 'TechHub Electronics',
        username: 'techhub',
        description: 'Your one-stop shop for the latest electronics and gadgets',
        address: '123 Tech Street, San Francisco, CA 94102',
        email: 'support@techhub.com',
        contact: '+1-555-0123',
        logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=techhub',
        status: 'approved',
        isActive: true,
      },
    }),
    prisma.store.upsert({
      where: { userId: 'user_2' },
      update: {},
      create: {
        userId: 'user_2',
        name: 'Smart Gadgets Pro',
        username: 'smartgadgets',
        description: 'Premium smart devices and accessories',
        address: '456 Innovation Ave, Austin, TX 78701',
        email: 'hello@smartgadgets.com',
        contact: '+1-555-0456',
        logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=smartgadgets',
        status: 'approved',
        isActive: true,
      },
    }),
  ])

  console.log('✅ Created stores')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'smartphones' },
      update: {},
      create: {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones and mobile devices',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'laptops' },
      update: {},
      create: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Powerful laptops for work and gaming',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'headphones' },
      update: {},
      create: {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Premium audio headphones',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'earphones' },
      update: {},
      create: {
        name: 'Earphones',
        slug: 'earphones',
        description: 'Wireless and wired earphones',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'smartwatches' },
      update: {},
      create: {
        name: 'Smartwatches',
        slug: 'smartwatches',
        description: 'Smart wearable devices',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tablets' },
      update: {},
      create: {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablets and iPad devices',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Tech accessories and gadgets',
      },
    }),
  ])

  console.log('✅ Created categories')

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'wireless' },
      update: {},
      create: { name: 'Wireless', slug: 'wireless' },
    }),
    prisma.tag.upsert({
      where: { slug: 'premium' },
      update: {},
      create: { name: 'Premium', slug: 'premium' },
    }),
    prisma.tag.upsert({
      where: { slug: 'best-seller' },
      update: {},
      create: { name: 'Best Seller', slug: 'best-seller' },
    }),
    prisma.tag.upsert({
      where: { slug: 'new-arrival' },
      update: {},
      create: { name: 'New Arrival', slug: 'new-arrival' },
    }),
    prisma.tag.upsert({
      where: { slug: 'trending' },
      update: {},
      create: { name: 'Trending', slug: 'trending' },
    }),
  ])

  console.log('✅ Created tags')

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      description: 'The latest flagship smartphone from Apple with A17 Pro chip, titanium design, and advanced camera system.',
      mrp: 1399.99,
      price: 1299.99,
      images: ['https://images.unsplash.com/photo-1696446702061-cbd8c8b6c1f8?w=800'],
      categoryId: categories.find(c => c.slug === 'smartphones').id,
      storeId: stores[0].id,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.',
      mrp: 1299.99,
      price: 1199.99,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      categoryId: categories.find(c => c.slug === 'smartphones').id,
      storeId: stores[0].id,
    },
    {
      name: 'AirPods Pro (2nd Gen)',
      description: 'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.',
      mrp: 249.99,
      price: 229.99,
      images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'],
      categoryId: categories.find(c => c.slug === 'earphones').id,
      storeId: stores[1].id,
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life.',
      mrp: 399.99,
      price: 349.99,
      images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800'],
      categoryId: categories.find(c => c.slug === 'headphones').id,
      storeId: stores[1].id,
    },
    {
      name: 'MacBook Pro 16" M3 Max',
      description: 'The most powerful MacBook Pro ever with M3 Max chip and stunning display.',
      mrp: 3499.99,
      price: 3299.99,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      categoryId: categories.find(c => c.slug === 'laptops').id,
      storeId: stores[0].id,
    },
    {
      name: 'Dell XPS 15',
      description: 'Premium Windows laptop with Intel Core i9 and NVIDIA RTX 4070.',
      mrp: 2499.99,
      price: 2299.99,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      categoryId: categories.find(c => c.slug === 'laptops').id,
      storeId: stores[1].id,
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced health features and Always-On Retina display.',
      mrp: 429.99,
      price: 399.99,
      images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'],
      categoryId: categories.find(c => c.slug === 'smartwatches').id,
      storeId: stores[0].id,
    },
    {
      name: 'iPad Pro 12.9" M2',
      description: 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
      mrp: 1199.99,
      price: 1099.99,
      images: ['https://images.unsplash.com/photo-1585790050230-5dd28404f9bc?w=800'],
      categoryId: categories.find(c => c.slug === 'tablets').id,
      storeId: stores[0].id,
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Advanced wireless mouse with ultra-fast scrolling and quiet clicks.',
      mrp: 99.99,
      price: 89.99,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
      categoryId: categories.find(c => c.slug === 'accessories').id,
      storeId: stores[1].id,
    },
    {
      name: 'Anker PowerCore 20K',
      description: 'High-capacity portable charger with USB-C Power Delivery.',
      mrp: 79.99,
      price: 64.99,
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
      categoryId: categories.find(c => c.slug === 'accessories').id,
      storeId: stores[1].id,
    },
  ]

  const createdProducts = []
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    })
    createdProducts.push(createdProduct)
  }

  console.log('✅ Created products')

  // Add tags to products
  await prisma.productTag.createMany({
    data: [
      { productId: createdProducts[0].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[0].id, tagId: tags.find(t => t.slug === 'best-seller').id },
      { productId: createdProducts[0].id, tagId: tags.find(t => t.slug === 'new-arrival').id },
      { productId: createdProducts[1].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[1].id, tagId: tags.find(t => t.slug === 'trending').id },
      { productId: createdProducts[2].id, tagId: tags.find(t => t.slug === 'wireless').id },
      { productId: createdProducts[2].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[3].id, tagId: tags.find(t => t.slug === 'wireless').id },
      { productId: createdProducts[3].id, tagId: tags.find(t => t.slug === 'best-seller').id },
      { productId: createdProducts[4].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[4].id, tagId: tags.find(t => t.slug === 'best-seller').id },
      { productId: createdProducts[5].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[6].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[6].id, tagId: tags.find(t => t.slug === 'trending').id },
      { productId: createdProducts[7].id, tagId: tags.find(t => t.slug === 'premium').id },
      { productId: createdProducts[7].id, tagId: tags.find(t => t.slug === 'new-arrival').id },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Added tags to products')

  // Create a sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off for new users',
      discount: 10,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2026-12-31'),
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'SAVE20' },
    update: {},
    create: {
      code: 'SAVE20',
      description: '20% off for members',
      discount: 20,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: new Date('2026-12-31'),
    },
  })

  console.log('✅ Created coupons')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
