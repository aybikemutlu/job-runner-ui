import axiosClient from './axiosClient';

export function getRun(runId) {
  return axiosClient.get(`/v1/runs/${runId}`).then(r => r.data);
}

export function getRunResult(runId) {
  return axiosClient.get(`/v1/runs/${runId}/result`).then(r => r.data);
}
