import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/internal/Observable';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  api_url = environment.apiUrl;
  httpOptions = null;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

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

  getAnswer(answers): Observable<any> {
    return this.http.post<any>(
      this.api_url + `/api/checkans/`,
      JSON.stringify(answers),
      this.httpOptions
      );
  }

  checkAnswers(ans): Observable<any> {
    const q = Object.keys(ans);

    const answers = q.map(element => {
      return {
        quiz_id: element,
        answer: ans[element]
      };
    });

    return this.getAnswer(answers);
  }

}
