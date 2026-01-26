import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CatchupService {
    private baseUrl = `${environment.apiUrl}/catchup`;

    constructor(private http: HttpClient) { }

    getCatchupSessions(classGroupId?: string, teacherId?: string, departmentId?: string): Observable<any[]> {
        const params: any = {};
        if (classGroupId) params.classGroupId = classGroupId;
        if (teacherId) params.teacherId = teacherId;
        if (departmentId) params.departmentId = departmentId;
        return this.http.get<any[]>(this.baseUrl, { params });
    }

    createCatchupSession(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, data);
    }

    updateCatchupSession(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data);
    }

    deleteCatchupSession(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }
}
