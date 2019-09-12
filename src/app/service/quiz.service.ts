import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  api_url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {}

  getLevelQuizData(drug_id, drug_info_type): Observable<any> {
    return this.http.get<any>(this.api_url + `/api/quiz/filter/?drug=${drug_id}&drug_info_type=${drug_info_type}&format=json`);
  }

  getQuizInfo(): Observable<any> {
    return from(this.storage.get('QUIZ_LEVEL')).pipe(
      mergeMap((level) => {
        const data = level.data[0];
        const drug_id = data.drug.drug_id;
        const drug_info_type = data.drug_info_type.drug_info_type_id;

        return this.getLevelQuizData(drug_id, drug_info_type);
      })
    );
  }
}
