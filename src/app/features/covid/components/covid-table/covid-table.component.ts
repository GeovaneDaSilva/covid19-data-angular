import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CovidService } from '../../services/covid.service';
import { CaseByDate } from '../../models/case-by-date';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-covid-table',
  templateUrl: './covid-table.component.html',
  styleUrls: ['./covid-table.component.css']
})
export class CovidTableComponent implements OnInit,AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'caseType', 'total'];
  caseTypes: string[] = ['Confirmed', 'Probable', 'Recovered', 'Death'];

  dataSource = new MatTableDataSource<CaseByDate>();
  range: FormGroup;
  maxDate!: Date;
  selectedCaseType: string = '';

  loading = false;
  errorMessage: string = '';

  constructor(private covidService: CovidService) {
    this.range = new FormGroup({
      startDate: new FormControl<Date | null>(null,Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.range.get('startDate')?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.updateEndDate();
      });

    this.range.get('endDate')?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.loadData());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    const start = this.range.get('startDate')?.value;
    const end = this.range.get('endDate')?.value;

    if(!(start && end)) return;

    if (this.isDateRangeValid(start,end)) {
      this.errorMessage = '';
      this.loading = true;
      const formattedStartDate = start.toISOString();
      const formattedEndDate = end.toISOString();
      this.covidService.getCovidCases(formattedStartDate, formattedEndDate, this.selectedCaseType).subscribe({
        next:(data)=>{
          this.dataSource.data = data;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          });
          this.loading = false;
        },error: (error) =>{
          this.errorMessage = error.message;
          this.loading = false;
        }
      });
    }else{
      this.errorMessage = 'The date range cannot be more than 7 days.';
    }
  }

  clearData():void {
    this.range.reset();
    this.selectedCaseType = '';
    this.errorMessage = '';
    this.dataSource.data = [];
  }

  isDateRangeValid(start: Date, end: Date): boolean {
    if (start && end) {
      // Calculate the difference in milliseconds
      const timeDiff = end.getTime() - start.getTime();
      // Convert the difference to days
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      return dayDiff <= 6;
    }
    return false;
  }

  updateEndDate() {
    const startDate = this.range.get('startDate')?.value;
    const endDateControl = this.range.get('endDate');

    if (startDate) {
      const minEndDate = new Date(startDate);
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(maxEndDate.getDate() + 6);


      endDateControl?.setValidators([
        Validators.min(minEndDate.getTime()),
        Validators.max(maxEndDate.getTime()),
        Validators.required
      ]);
      endDateControl?.updateValueAndValidity();
    } else {
      endDateControl?.clearValidators();
      endDateControl?.updateValueAndValidity();
    }
  }

  onCaseTypeChange(caseType: string): void {
    this.selectedCaseType = caseType;
    this.loadData();
  }

}
