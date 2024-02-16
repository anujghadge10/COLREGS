import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable } from 'rxjs';

const BACKEND_URL: any = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  async fetchVideoById1(id: any) {
    // try {
    // const headers = new HttpHeaders().set('Range', '10000');
    // const options = {
    //   headers: headers,
    //   responseType: 'arraybuffer' as 'json', // You may need to specify the responseType correctly
    // };

    // const Response = await this.http
    //   .get(BACKEND_URL + `/media/video/${15}/${13}`, options)
    //   .toPromise();
    // return Response as ArrayBuffer;

    return this.http.get(BACKEND_URL + `/media/video/${15}/${13}`);
    // } catch (error) {
    //   console.error('Error fetching video:', error);
    //   throw error; // Rethrow the error if needed
    // }
  }

  fetchVideoprogress(courseId: any, userId: any) {
    return this.http.get(
      BACKEND_URL + `/ror/video-progress/${courseId}/${userId}`
    );
  }

  saveVideoProgress(data: any) {
    return this.http.post(BACKEND_URL + `/ror/video-progress`, data);
  }
}
