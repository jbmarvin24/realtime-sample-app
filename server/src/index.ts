import { db } from './db';
import { startApolloServer } from './server';

startApolloServer().catch((err) => {
  console.log(err);
  process.exit(1);
});

db.$connect()
  .then(() => console.log('✅ Connected to the database.'))
  .catch(async (err) => {
    console.log(err);

    await db.$disconnect();
    process.exit(1);
  });
