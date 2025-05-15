import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ClinicLocationDto } from '../dtos/clinic-locations.dto';

@Injectable({ providedIn: 'root' })
export class ClinicLocationsGetService {
  constructor(private http: HttpClient) {}

  handle(): Observable<ClinicLocationDto[]> {
    return this.http.get<any[]>(`${environment.restUrl}/clinic/locations`);
  }
}
