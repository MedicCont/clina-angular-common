import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { environment } from 'environments/environment';
import { Observable, map } from 'rxjs';
import { ClinicLocationDto } from '../dtos/clinic-locations.dto';
import { CLINIC_LOCATIONS_QUERY } from '../queries/clinic-locations.query';

@Injectable({ providedIn: 'root' })
export class ClinicLocationsGetService {
  constructor(private readonly apollo: Apollo, private http: HttpClient) {}

  handle(): Observable<ClinicLocationDto[]> {
    return this.http.get<any[]>(`${environment.restUrl}/clinic/locations`);
    return this.apollo
      .query({
        query: CLINIC_LOCATIONS_QUERY,
      })
      .pipe(map((res: any) => res.data.clinicLocations));
  }
}
