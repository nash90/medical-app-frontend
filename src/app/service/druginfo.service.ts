import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drug } from '../model/drug';

@Injectable({
  providedIn: 'root'
})
export class DruginfoService {

  constructor(private http: HttpClient) { }

  getDrugList(): Observable<Drug[]> {
    return this.http.get<Drug[]>('http://localhost:8000/api/drugs/?format=json');
  }
}
