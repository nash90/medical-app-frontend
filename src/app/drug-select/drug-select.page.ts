import { Component, OnInit } from '@angular/core';

import { DruginfoService } from '../service/druginfo.service';
import { Drug } from '../model/drug';
import { Observable } from 'rxjs';

import { DRUG_LIST } from '../model/drug-mock';

@Component({
  selector: 'app-drug-select',
  templateUrl: './drug-select.page.html',
  styleUrls: ['./drug-select.page.scss'],
})
export class DrugSelectPage implements OnInit {

  public drugs: Drug[] = [];
  drugs$: Observable<Drug[]>;
  selectedDrugId: number;

  constructor(private druginfoService: DruginfoService) { }

  ngOnInit() {
    this.drugs$ = this.druginfoService.getDrugList();
  }

  selectDrug() {
    console.log('selected', this.selectedDrugId);
  }

}
