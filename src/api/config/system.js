import http from '@/utils/http.js';
import to from 'await-to-js';

export function getSystems(params) {
  return to(http.get('/system/list', { params }));
}

export function getAllSystem() {
  return to(http.get('/system/all'));
}

export function addSystem(data) {
  return to(http.post('/system/insert', data));
}

export function editSystem(data) {
  return to(http.post('/system/update', data));
}

export function delSystem(data) {
  return to(http.post('/system/delete', data));
}

export function resolveSwagger(params) {
  return to(http.get('/system/resolve/swagger', { params }));
}
