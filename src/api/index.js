import http from '@/utils/http.js';
import to from 'await-to-js';

export function tryConnect(params) {
  return to(http.get('/tryConnect', { params }));
}
