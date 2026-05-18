import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const backupQueue = new Queue('alphapanel-backup', { connection });
export const sslQueue = new Queue('alphapanel-ssl-renew', { connection });

new Worker(
  'alphapanel-backup',
  async (job) => {
    console.log(`[AlphaPanel Worker] Processing backup job ${job.id}`, job.data);
    // Delegate to daemon via internal client
    return { completed: true };
  },
  { connection },
);

new Worker(
  'alphapanel-ssl-renew',
  async (job) => {
    console.log(`[AlphaPanel Worker] SSL renew ${job.id}`, job.data);
    return { renewed: true };
  },
  { connection },
);

console.log('AlphaPanel workers started');
