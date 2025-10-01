import axiosClient from './axiosClient';

export function enqueueCommand(payload) {
  return axiosClient.post('/v1/jobs/command', payload).then(r => r.data);
}

export function enqueueCrawl(payload) {
  return axiosClient.post('/v1/jobs/crawl', payload).then(r => r.data);
}
