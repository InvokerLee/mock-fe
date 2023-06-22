import http from '@/utils/http.js';
import to from 'await-to-js';

export function getUserIps(params) {
  return to(http.get('/ip/list', { params }));
}

export function getIpsByUser(params) {
  return to(http.get('/ip/findByUser', { params }));
}

export function addUserIp(data) {
  return to(http.post('/ip/insert', data));
}

export function editUserIp(data) {
  return to(http.post('/ip/update', data));
}

export function delUserIp(data) {
  return to(http.post('/ip/delete', data));
}
