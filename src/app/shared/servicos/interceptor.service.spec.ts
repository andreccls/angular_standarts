import { TestBed } from '@angular/core/testing';

import { InterceptorService } from './interceptor.service';
import { HttpClientTestingModule, HttpTestingController, RequestMatch } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';

// Classe para testar apenas o header
@Injectable()
export class DataService {
  ROOT_URL = `https://jsonplaceholder.typicode.com`;
  constructor(private http: HttpClient) { }
  getPosts() {
    return this.http.get(`${this.ROOT_URL}/posts`);
  }
}

describe('InterceptorService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
       ],
      providers: [
        DataService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true,
        }
      ],
    });

    service = TestBed.inject(DataService as Type<DataService>);
    httpMock = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
  });

  it('Interceptor criado e injetado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('Quando requisita uma API adiciona os cabeçalhos do interceptor', () => {
    service.getPosts().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const requestMatch: RequestMatch = {url: `${service.ROOT_URL}/posts`, method: 'GET'};
    const httpRequest = httpMock.expectOne(requestMatch);

    expect(httpRequest.request.method).toEqual('GET');
    expect(httpRequest.request.headers.has('Content-Type')).toBeTruthy();
    expect(httpRequest.request.headers.has('Authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('Content-Type')).toEqual('application/json');
  });
});
