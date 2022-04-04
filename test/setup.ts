import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

/**
 * We delete the whole DB and rely on TypeORM to recreate
 * it before next test run
 */
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch {
    // Err will be thrown if file doesn't exist, and we suppress that error
  }
});

/**
 * We have to close connection as we delete the db
 * for each test run, and TypeORM maintains the connection
 */
global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
});
