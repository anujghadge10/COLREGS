import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

const BACKEND_URL: any = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private role$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  private isScroll = new BehaviorSubject<boolean>(false);

  get isScroll$() {
    return this.isScroll.asObservable();
  }
  private isScroll1 = new BehaviorSubject<boolean>(false);

  get isScroll1$() {
    return this.isScroll1.asObservable();
  }

  setIsScroll(value: boolean) {
    this.isScroll.next(value);
  }
  setIsScroll1(value: boolean) {
    this.isScroll1.next(value);
  }

  // fetchAllCourses(email: string) {
  //   return this.http.get(BACKEND_URL + `/users/courses/${email}`);
  // }

  // fetchCourses(courseId: number, userId: any) {
  //   return this.http.get(BACKEND_URL + `/users/course/${courseId}/${userId}`);
  // }

  // fetchCourseContent(courseId: number, userId: any) {
  //   return this.http.get(BACKEND_URL + `/users/courseContent/${courseId}/${userId}`);
  // }

  // courseThumbnail(courseId: number) {
  //   return this.http.get(BACKEND_URL + `/users/courseThumbnail/${courseId}`);
  // }

  // fetchPostsOfCourse(courseId: any) {
  //   return this.http.get(BACKEND_URL + `/users/posts/${courseId}`);
  // }

  getQuestsionByVideoId(id: any) {
    return this.http.get(BACKEND_URL + `/ror/questions/${id}`);
  }

  saveAssessmentData(data: any) {
    return this.http.post(BACKEND_URL + `/ror/Assessment`, data);
  }

  getAssesmentData(id: any) {
    return this.http.get(BACKEND_URL + `/ror/Assessment/${id}`);
  }

  retakeAssessment(id: any) {
    return this.http.delete(BACKEND_URL + `/ror/retake-assessment/${id}`);
  }

  createAssessment(
    id: any,
    userId: any,
    courseId: any,
    type: any,
    shuffleQuestions: any
  ) {
    const data = { userId, id, type, courseId, shuffleQuestions };
    return this.http.post(BACKEND_URL + `/ror/new-assessment`, data);
  }

  saveQuestionProgress(data: any) {
    return this.http.post(BACKEND_URL + `/ror/assessment-question`, data);
  }

  resumeAssessment(id: any) {
    return this.http.get(BACKEND_URL + `/ror/resume-assessment/${id}`);
  }

  saveFeedback(data: any) {
    return this.http.post(BACKEND_URL + `/ror/feedback`, data);
  }

  createror(data: any) {
    return this.http.post(BACKEND_URL + '/ror/comapny-users', data);
  }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }
}
