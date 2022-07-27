import {Fetcher} from './fetcher';

describe('Fetcher Test', () => {
  const fetcher = new Fetcher();
  it('It should work as a paralel and return as a text', async () => {
    jest.spyOn(fetcher, 'sendRequest').mockResolvedValue(
      JSON.stringify({
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false,
      })
    );

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
    jest.spyOn(fetcher, 'sendRequest').mockResolvedValue({});
    const testResponse: string[] = await fetcher.runInParallel([], 2);
    expect(testResponse).toEqual([]);
  });
});
