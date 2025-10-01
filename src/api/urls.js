import axiosClient from './axiosClient';

export function getRunUrls(runId, params) {
  return axiosClient.get(`/v1/runs/${runId}/urls`, { params }).then(r => r.data);
}
