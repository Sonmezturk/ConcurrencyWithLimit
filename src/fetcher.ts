import axios, {AxiosResponse} from 'axios';
import pLimit, {Limit} from 'p-limit';

export class Fetcher {
  async runInParallel(urls: string[], concurrency: number): Promise<string[]> {
    const limit: Limit = pLimit(concurrency);
    const resolves: (AxiosResponse | {data: {}})[] = await Promise.all(
      urls.map(url =>
        limit(async () => {
          try {
            const data: AxiosResponse = await axios.get(url);
            return data;
          } catch (e) {
            console.log(e);
            return {data: {}};
          }
        })
      )
    );
    return resolves.map(resolve => JSON.stringify(resolve.data));
  }
}
