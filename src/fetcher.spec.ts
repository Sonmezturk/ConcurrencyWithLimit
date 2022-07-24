import {Fetcher} from './fetcher';
import axios from 'axios';
jest.mock('axios');

describe('Fetcher Test', () => {
  const fetcher = new Fetcher();
  it('It should work as a paralel and return as a text', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false,
      },
    });
    const testResponse: string[] = await fetcher.runInParallel(
      [
        'https://jsonplaceholder.typicode.com/todos/1',
        'https://jsonplaceholder.typicode.com/todos/2',
        'https://jsonplaceholder.typicode.com/todos/3',
        'https://jsonplaceholder.typicode.com/todos/4',
        'https://jsonplaceholder.typicode.com/todos/5',
        'https://jsonplaceholder.typicode.com/todos/6',
        'https://jsonplaceholder.typicode.com/todos/7',
        'https://jsonplaceholder.typicode.com/todos/8',
        'https://jsonplaceholder.typicode.com/todos/9',
      ],
      2
    );
    expect(typeof testResponse[0]).toEqual('string');
  });

  it('When it receive empty array', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({});
    const testResponse: string[] = await fetcher.runInParallel([], 2);
    expect(testResponse).toEqual([]);
  });

  it('When error case appare', async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>)
      .mockResolvedValueOnce({
        data: {
          userId: 1,
        },
      })
      .mockRejectedValueOnce('Error')
      .mockResolvedValue({
        data: {
          userId: 3,
        },
      });
    const testResponse: string[] = await fetcher.runInParallel(
      [
        'https://jsonplaceholder.typicode.com/todos/1',
        'https://jsonplaceholder.typicode.com/todos/2',
        'https://jsonplaceholder.typicode.com/todos/3',
      ],
      2
    );
    expect(JSON.parse(testResponse[0]).userId).toEqual(1);
    expect(JSON.parse(testResponse[1]).userId).toBeUndefined();
    expect(JSON.parse(testResponse[2]).userId).toEqual(3);
  });
});
