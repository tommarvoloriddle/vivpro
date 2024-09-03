// __tests__/api/songs.test.js
import { GET } from '@/app/api/songs/route';
import { MongoClient } from 'mongodb';

jest.mock('mongodb', () => {
  const actual = jest.requireActual('mongodb');
  return {
    ...actual,
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            toArray: jest.fn().mockResolvedValue([{ title: 'Test Song' }]),
          }),
          countDocuments: jest.fn().mockResolvedValue(1),
        }),
      }),
      close: jest.fn(),
    })),
  };
});

describe('GET /api/songs', () => {
  it('returns a list of songs with pagination', async () => {
    const req = { url: 'http://localhost:3000/api/songs?page=1&limit=10' };
    const res = await GET(req);
    const json = await res.json();

    expect(json.data).toEqual([{ title: 'Test Song' }]);
    expect(json.page).toBe(1);
    expect(json.limit).toBe(10);
  });
});
