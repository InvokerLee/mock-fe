import http from '@/utils/http.js';
import to from 'await-to-js';

export function getRescs(params) {
  return to(http.get('/resc/list', { params }));
}

export function addResc(data) {
  return to(http.post('/resc/insert', data));
}

export function addManyResc(data) {
  return to(http.post('/resc/insertMany', data));
}

export function editResc(data) {
  return to(http.post('/resc/update', data));
}

export function delResc(data) {
  return to(http.post('/resc/delete', data));
}

export function switchProxy(params) {
  return to(http.get('/resc/switchProxy', { params }));
}

export function getMockDatas(params) {
  return to(http.get('/mockData/list', { params }));
}

export function addMockData(data) {
  return to(http.post('/mockData/insert', data));
}

export function editMockData(data) {
  return to(http.post('/mockData/update', data));
}

export function setPriority(data) {
  return to(http.post('/mockData/setPriority', data));
}

export function delMockData(data) {
  return to(http.post('/mockData/delete', data));
}
