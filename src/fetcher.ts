import Queue from 'queue';
import https from 'https';

export class Fetcher {
  counter = 0;
  queue = Queue({results: []});

  async controlConcurrency(fn: Function, concurrency: number) {
    return new Promise(resolve => {
      this.queue.push(async () => {
        this.counter++;
        const result = await fn();
        resolve(result);
        if (this.queue.length > 0) {
          this.queue.shift()();
        }
      });

      if (this.counter < concurrency) {
        this.queue.shift()();
      }
    });
  }

  async runInParallel(urls: string[], concurrency: number) {
    const promises: Promise<any>[] = urls.map(url => {
      return this.controlConcurrency(async () => {
        try {
          const data = await this.sendRequest(url);
          return data;
        } catch (e) {
          console.log(e);
          return {};
        }
      }, concurrency);
    });
    return await Promise.all(promises);
  }

  sendRequest(url: string) {
    return new Promise((resolve, reject) => {
      const lib = https;
      const request = lib.get(url, response => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(
            new Error(
              'Failed to load page, status code: ' + response.statusCode
            )
          );
        }
        const body = [];
        response.on('data', chunk => body.push(chunk));
        response.on('end', () => resolve(body.join('')));
      });
      request.on('error', err => reject(err));
    });
  }
}
