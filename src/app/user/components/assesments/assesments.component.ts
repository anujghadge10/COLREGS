import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'et-assesments',
  templateUrl: './assesments.component.html',
  styleUrls: ['./assesments.component.css'],
})
export class AssesmentsComponent {
  assessmentvideoId: any;
  videoId: any;
  assesmentData: any;
  totalQuestions!: number;
  radioValue = 'A';
  currentQuestionIndex = 0;
  currentQuestion: any[] = [];
  isAssesmentCompleted: boolean = false;
  isAssesmentStarted: boolean = false;
  AnswerArray: any[] = [];
  selectedOptions: string[] = [];
  buttonSizeForm: FormGroup;
  resultForm: FormGroup;
  audioContext!: AudioContext;
  audioBuffer!: AudioBuffer;
  answerStatus: any;
  mcqValue = new FormControl({});
  mcaValue = new FormControl({});
  tfValue = new FormControl({});
  blanksValue = new FormControl({});

  groupedQuestions: Map<number, any[]> = new Map();
  isRatingVisible = false;
  isResultVisible = false;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  ratingValue: number = 0; // Set the initial value here
  totalQuestion: any;
  totalAttempts: any;
  finalScore: any;
  assessmentUniqueId!: any;
  currentPendingAssessment!: any;
  shuffleQuestions: any;
  assessmentType!: string;
  userId: any;
  // wrongAnswer(type: string): void {
  //   this.message.success( `Incorrect Answer, Please Try Again`);
  // }

  hello() {
    this.isResultVisible = true;
    this.isAssesmentCompleted = true;
    this.isAssesmentStarted = false;
  }

  timeOut(type: string): void {
    this.message.warning('Countdown Timer has ran out');
    // const modal = this.modal.warning({
    //   nzTitle: 'Countdown Timer has ran out',
    //   nzContent: `you have ${this.attempt - 2} attempt remaining`,

    //   nzClosable: true,
    //   nzCentered: true,
    //   nzOkDisabled: true,
    //   nzOkText: null,
    // });
    // setTimeout(() => {
    //   modal.destroy();
    // }, 2000);
  }

  navigateAway(type: string): void {
    // this.message.create(type, `Countdown timer has run out.`);
    this.message.warning('Your attempt limit is exceeded');
  }

  companyName!: string;
  isMessageShown: boolean = false;
  isWrongBefore: boolean = false;
  attempt: number = 4;
  TimeCounter: number = 60;
  timerStatus: any;
  timerPercent: any;
  feedValue: string | undefined;
  formatOne = (TimeCounter: number): string =>
    `${(TimeCounter / 1.65).toFixed(0)}`;
  constructor(
    private url: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService,
    private authService: AuthService
  ) {
    // console.log('videoId', this.router.getCurrentNavigation()?.extras.state?.['videoId'])

    // this['videoId'] = this.router.getCurrentNavigation()?.extras.state?.['videoId']
    this.buttonSizeForm = this.formBuilder.group({
      radioValue: new FormControl('', [Validators.required]),
      inputValue: new FormControl('', [Validators.required]),
      booleanValue: new FormControl('', [Validators.required]),
    });
    this.resultForm = this.formBuilder.group({});
    this.audioContext = new AudioContext();
  }

  AssessmentAttempts!: number;
  marksPerQuestion: any;
  assessmentAttemptNo: number = 0;
  questionAttemptNo: number = 0;
  noAbbrevation: any;
  feedbackSubscription: Subscription | undefined;

  async getAssesmentQuestions(Id: any) {
    await this.userService.getQuestsionByVideoId(Id).subscribe((res: any) => {
      if (res) {
        console.log('shuffled', res);
        this.totalQuestions = res.length;
        this.assesmentData = res.map((element: any, index: any) => {
          return { ...element, index };
        });
        console.log(this.assesmentData);
        this.populateQuestionData();
      }
    });
  }

  attemptColor: any;
  isAssesmentExist: boolean = false;
  async retakeAssessment() {
    await this.userService
      .retakeAssessment(this.userId)
      .subscribe(async (res: any) => {
        console.log(res);
        if (res) {
          this.isAssesmentCompleted = false;
          this.isAssesmentStarted = true;
          this.buttonSizeForm.reset();
          this.selectedOptions = [];
          this.TimeCounter = 60;
          this.addTimer();

          await this.getAssesmentQuestions(this.videoId);
        }
      });
  }

  responseArray!: any[];
  async onSubmit(data: any) {
    console.log('onSubmit ==>', data);
    await this.nextQuestion(data).then(async (res: any) => {
      if (res) {
        await this.stopTimer();
        this.isResultVisible = true;
        const companyId = 1;
        const Data = {
          assessmentUniqueId:
            this.assessmentUniqueId.assessmentUniqueId ||
            this.assessmentUniqueId,
          assessmentStatus: 'Submitted',
          courseId: this.courseId,
          companyId: companyId,
        };
        console.log('onSubmit ==>', Data);
        await this.userService
          .saveAssessmentData(Data)
          .subscribe((res: any) => {
            if (res) {
              console.log(res);
              this.isAssesmentStarted = false;
              let userArray: any = [];
              this.points = 0;
              res.forEach((element: any) => {
                userArray.push(JSON.parse(element.selectedAnswer));
                this.points = this.points + element.marksObtained;
              });
              this.responseArray = this.mergeArrays(
                this.assesmentData,
                userArray
              );
              this.groupQuestionsByIndex();
            }
          });
      } else {
        if (this.attempt == 1) {
          await this.stopTimer();

          await this.navigateAway('error');
          this.router.navigate([`/user/course-details`]);
        }
      }
    });
  }

  points = 0;
  selectOptionmcq(option: string): void {
    this.buttonSizeForm.get('radioValue')?.setValue(option);

    // Remove 'selected' class from all options
    document.querySelectorAll('.questionoptbtn').forEach((el) => {
      el.classList.remove('selected');
    });
    document.querySelectorAll('.questionoptbtn1').forEach((el) => {
      el.classList.remove('selected');
    });

    // Add 'selected' class to the clicked option
    const selectedOption = document.getElementById(`option${option}`);
    if (selectedOption) {
      selectedOption.parentElement?.classList.add('selected');
    }
  }
  selectOptiontf(option: string): void {
    this.buttonSizeForm.get('booleanValue')?.setValue(option);

    // Remove 'selected' class from all options
    document.querySelectorAll('.questionoptbtn').forEach((el) => {
      el.classList.remove('selected');
    });
    document.querySelectorAll('.questionoptbtn1').forEach((el) => {
      el.classList.remove('selected');
    });

    // Add 'selected' class to the clicked option
    const selectedOption = document.getElementById(`option${option}`);
    if (selectedOption) {
      selectedOption.parentElement?.classList.add('selected');
    }
  }

  async nextQuestion(data: any): Promise<any> {
    this.timerStatus = 'success';

    if (data.questionType === 'MCQ') {
      const mcqAns = this.buttonSizeForm.get('radioValue')?.value;

      if (
        mcqAns.trim().toLowerCase() !== data.correctAnswer.trim().toLowerCase()
      ) {
        if (this.attempt == 2) {
          await this.stopTimer();
          await this.navigateAway('error');
          this.router.navigate([`/user/course-details`]);
        }
        this.loadAudio(false);
        this.attempt = this.attempt - 1;
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: mcqAns,
          attempt: this.attempt,
          isCorrect: false,
          questionId: data.id,
        };
        this.AnswerArray.push(AnsData);
        if (this.attempt <= 2) {
          await this.navigateAway('error');
          await this.forceSubmit(data.id);
          this.router.navigate([`/user/course-details`]);

          this.questionAttemptNo = 0;
        }
        this.questionAttemptNo += 1;
        this.answerStatus = 'incorrect';
        this.message.error('Incorrect Answer, Please Try Again');
        this.TimeCounter = 60;
        return false;
      } else {
        this.message.success('Correct Answer');

        this.points = this.marksPerQuestion;
        this.loadAudio(true);
        this.attempt = this.attempt - 1;
        if (this.questionAttemptNo === 0) {
          this.points = this.marksPerQuestion;
        } else if (this.questionAttemptNo === 1) {
          this.points = 0;
        }
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: mcqAns,
          attempt: this.attempt,
          isCorrect: true,
          questionId: data.id,
          points: this.points,
        };
        this.AnswerArray.push(AnsData);
        console.log(AnsData);
        await this.saveQuestionProgress({
          index: this.currentQuestionIndex,
          AnswerArray: this.AnswerArray,
          points: this.points,
          questionId: data.id,
        });
        //////window.alert(this.points)
        if (this.currentQuestionIndex !== this.totalQuestions - 1) {
          this.currentQuestionIndex = this.currentQuestionIndex + 1;
        }
        this.buttonSizeForm.get('radioValue')?.reset;
        this.populateQuestionData();
        this.attempt = 4;
        this.answerStatus = 'correct';
        this.questionAttemptNo = 0;
        this.TimeCounter = 60;
        return true;
      }

      this.buttonSizeForm.reset();
    } else if (data.questionType === 'MCA') {
      const stringArray = data.correctAnswer
        .split(',')
        .map((item: any) => item.trim())
        .join(',');
      const mcaAns = this.arraysAreEqual(stringArray, this.selectedOptions);
      if (mcaAns !== true || mcaAns === undefined) {
        this.loadAudio(false);

        this.attempt = this.attempt - 1;
        this.message.error('Incorrect Answer, Please Try Again');
        this.answerStatus = 'incorrect';
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: this.selectedOptions,
          attempt: this.attempt,
          isCorrect: false,
          questionId: data.id,
        };
        this.AnswerArray.push(AnsData);
        if (this.attempt <= 2) {
          await this.navigateAway('error');
          await this.forceSubmit(data.id);
          this.router.navigate([`/user/course-details`]);

          this.questionAttemptNo = 0;
        }
        this.questionAttemptNo += 1;
        this.isWrongBefore = true;
        this.TimeCounter = 60;
        return false;
      } else {
        this.message.success('Correct Answer');

        this.points = this.marksPerQuestion;
        this.loadAudio(true);
        this.attempt = this.attempt - 1;
        if (this.questionAttemptNo === 0) {
          this.points = this.marksPerQuestion;
        } else if (this.questionAttemptNo === 1) {
          this.points = 0;
        }
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: this.selectedOptions,
          attempt: this.attempt,
          isCorrect: true,
          questionId: data.id,
          points: this.points,
        };
        this.AnswerArray.push(AnsData);
        console.log(AnsData);
        await this.saveQuestionProgress({
          index: this.currentQuestionIndex,
          AnswerArray: this.AnswerArray,
          points: this.points,
          questionId: data.id,
        });
        //////window.alert(this.points)
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        this.buttonSizeForm.get('radioValue')?.reset;
        this.populateQuestionData();
        this.attempt = 4;
        this.answerStatus = 'correct';
        this.questionAttemptNo = 0;
        this.TimeCounter = 60;
        return true;
      }
      this.buttonSizeForm.reset();
    } else if (data.questionType === 'TF') {
      const tfAns = this.buttonSizeForm.get('booleanValue')?.value;
      if (tfAns !== data.correctAnswer) {
        this.loadAudio(false);
        this.attempt = this.attempt - 1;
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: tfAns,
          attempt: this.attempt,
          isCorrect: false,
          questionId: data.id,
        };
        this.AnswerArray.push(AnsData);
        if (this.attempt <= 2) {
          await this.navigateAway('error');
          await this.forceSubmit(data.id);
          this.router.navigate([`/user/course-details`]);

          this.questionAttemptNo = 0;
        }
        this.questionAttemptNo += 1;
        this.isWrongBefore = true;
        this.answerStatus = 'incorrect';
        this.message.error('Incorrect Answer, Please Try Again');
        this.TimeCounter = 60;
        return false;
      } else {
        this.message.success('Correct Answer');

        this.points = this.marksPerQuestion;
        this.loadAudio(true);
        this.attempt = this.attempt - 1;
        if (this.questionAttemptNo === 0) {
          this.points = this.marksPerQuestion;
        } else if (this.questionAttemptNo === 1) {
          this.points = 0;
        }
        const AnsData = {
          index: this.currentQuestionIndex,
          selectedAnswer: tfAns,
          attempt: this.attempt,
          isCorrect: true,
          questionId: data.id,
        };
        this.AnswerArray.push(AnsData);

        await this.saveQuestionProgress({
          index: this.currentQuestionIndex,
          questionId: data.id,
          AnswerArray: this.AnswerArray,
          points: this.points,
        });
        this.currentQuestionIndex = this.currentQuestionIndex + 1;
        this.buttonSizeForm.get('booleanValue')?.reset;
        this.populateQuestionData();
        this.attempt = 4;
        this.questionAttemptNo = 0;
        this.answerStatus = 'correct';
        this.TimeCounter = 60;
        return true;
      }
      this.buttonSizeForm.reset();
    }

    // this.TimeCounter = 60;

    if (this.answerStatus == 'correct') {
      return true;
    } else {
      return false;
    }
  }

  // arraysAreEqual(arr1: any[], arr2: any[]): boolean {
  //   if (arr1.length !== arr2.length) {
  //     return false;
  //   }

  //   const sortedArr1 = arr1.slice().sort();
  //   const sortedArr2 = arr2.slice().sort();

  //   return sortedArr1.every((value, index) => value === sortedArr2[index]);
  // }

  arraysAreEqual(arr1: any, arr2: any) {
    // Convert arr1 (comma-separated string) to an array
    const arr1Array = arr1.split(',').map((item: any) => item.trim());

    if (arr1Array.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1Array.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }

    return true;
  }

  selectOption(option: string) {
    // Check if the option is already selected
    const index = this.selectedOptions.indexOf(option);

    if (index !== -1) {
      // If it's selected, deselect it
      this.selectedOptions.splice(index, 1);
    } else {
      // If it's not selected, select it
      this.selectedOptions.push(option);
    }
    return this.selectedOptions;
  }
  isSelected(option: string): boolean {
    return this.selectedOptions.includes(option);
  }

  async loadAudio(value: boolean) {
    const soundPath = value
      ? 'assets/sounds/mixkit-achievement-bell-600.wav'
      : 'assets/sounds/mixkit-wrong-long-buzzer-954.wav';

    const response = await fetch(soundPath);
    const arrayBuffer = await response.arrayBuffer();
    this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      this.audioBuffer = buffer;
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    });
  }

  groupQuestionsByIndex() {
    this.responseArray.forEach(async (question) => {
      const index = question.index;

      if (this.groupedQuestions.has(index)) {
        await (this.groupedQuestions.get(index) as any[]).push(question);
      } else {
        await this.groupedQuestions.set(index, [question]);
      }
    });
    console.log('groupedQuestions', this.groupedQuestions);
  }

  mergeArrays(arr1: any[], arr2: any[]): any[] {
    const mergedMap = new Map();
    this.totalQuestion = arr1.length;
    this.totalAttempts = arr2.length;
    this.totalAttempts = this.totalQuestion - this.totalAttempts + 1;
    this.finalScore =
      // Populate the map with objects from the first array
      arr1.forEach((item: any) => {
        mergedMap.set(item.index, item);
        // Trigger change detection here
      });
    const mergedArray: any[] = [];

    arr2.forEach((items: any) => {
      for (let item of items) {
        const existingItem = mergedMap.get(item.index);
        const mergedObject = {
          index: existingItem.index,
          question: existingItem.question,
          optionA: existingItem.optionA,
          optionB: existingItem.optionB,
          optionC: existingItem.optionC,
          optionD: existingItem.optionD,
          questionType: existingItem.questionType,
          correctAnswer: existingItem.correctAnswer,
          attempts: item.attempt,
          selectedAnswer: item.selectedAnswer,
        };
        mergedArray.push(mergedObject);
      }
      //}
    });
    console.log('mergedArray', mergedArray);
    return mergedArray;
  }

  reviewTest(): void {
    this.isResultVisible = false;
    this.isAssesmentCompleted = true;
    this.isAssesmentStarted = false;
  }

  gotoRatings(): void {
    console.log('Button cancel clicked!');
    this.isResultVisible = false;
    this.isRatingVisible = true;
  }

  handleOk(): void {
    this.isRatingVisible = false;
    this.cd.detectChanges();
    // Accessing the rating value
    const selectedRating = this.ratingValue;
    console.log('Selected Rating:', selectedRating);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isRatingVisible = false;
    this.goBackToCourse();
  }

  courseId: any;
  goBackToCourse() {
    this.router.navigate(['/user/course-details']);
  }

  async startAssesments() {
    // Shuffle options in each question

    await this.userService
      .createAssessment(
        this.videoId,
        this.userId,
        this.courseId,
        this.assessmentType,
        this.assesmentData
      )
      .subscribe((res: any) => {
        console.log(res);
        this.assessmentUniqueId = res.assessmentUniqueId;
      });
    this.isAssesmentCompleted = false;
    this.isAssesmentStarted = true;
    await this.addTimer();
  }

  async resumeAssesments() {
    console.log(this.currentPendingAssessment[0].assessmentUniqueId);
    await this.userService
      .resumeAssessment(this.currentPendingAssessment[0].assessmentUniqueId)
      .subscribe(async (res: any) => {
        console.log(res);
        if (res) {
          const shuffledQuestions = this.shuffleOptionsInQuestions(res);
          this.assessmentUniqueId =
            this.currentPendingAssessment[0].assessmentUniqueId;
          this.assesmentData = await shuffledQuestions.sort(
            (a: any, b: any) => a.index - b.index
          );
          this.currentQuestionIndex = this.assesmentData[0].index;
          console.log('currentQuestionIndex', this.currentQuestionIndex);
          console.log(this.assesmentData);
          await this.populateQuestionData();
          this.isAssesmentCompleted = false;
          this.isAssesmentStarted = true;
          this.addTimer();
        }
      });
  }

  async saveQuestionProgress(data: any) {
    const questionData = {
      ...data,
      assessmentUniqueId: this.assessmentUniqueId,
    };
    await this.userService
      .saveQuestionProgress(questionData)
      .subscribe((res: any) => {
        console.log(res);
        this.AnswerArray = [];
      });
  }

  shuffleOptionsInQuestions(questions: any[]) {
    return questions.map((question: any) => {
      // Extract the options
      const { optionA, optionB, optionC, optionD, ...rest } = question;
      if (question.questionType !== 'TF') {
        // Shuffle all options
        const optionsArray = [optionA, optionB, optionC, optionD];
        this.shuffleArray(optionsArray);

        // Create a new question object with shuffled options and the rest of the properties
        return {
          optionA: optionsArray[0],
          optionB: optionsArray[1],
          optionC: optionsArray[2],
          optionD: optionsArray[3],
          ...rest,
        };
      } else {
        const optionsArray = [optionA, optionB];
        this.shuffleArray(optionsArray);

        // Create a new question object with shuffled options and the rest of the properties
        return {
          optionA: optionsArray[0],
          optionB: optionsArray[1],
          ...rest,
        };
      }
    });
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  populateQuestionData() {
    if (this.currentQuestionIndex < this.totalQuestions) {
      this.currentQuestion = this.assesmentData.filter((item: any) => {
        return item.index === this.currentQuestionIndex;
      });
    }
  }

  async addTimer() {
    await this.timeCounter();
    // const encryptedCourseId = CryptoJS.AES.encrypt(
    //   this.courseId.toString(),
    //   'encryptionKey'
    // ).toString();

    if (!this.isMessageShown) {
      //if (this.attempt === 2) {
      this.isAssesmentStarted = false;
      await this.navigateAway('error');
      this.router.navigate([`/user/course-details`]);
      // } else {
      //   this.timeoutActions();
      // }
    }
  }

  timeoutActions() {
    this.isAssesmentStarted = false;

    this.isMessageShown = true;
    this.attempt--;
    this.TimeCounter = 60;
    this.isMessageShown = false;
    this.timerStatus = 'success';

    this.addTimer();
  }

  timerInterval: any;
  isPulsating: boolean = false;

  timeCounter() {
    return new Promise<void>((resolve) => {
      this.timerInterval = setInterval(() => {
        if (this.TimeCounter < 15) {
          this.timerStatus = 'exception';
          // Enable pulsating animation when timer reaches 15 seconds
          this.isPulsating = true;
        } else if (this.TimeCounter > 15 && this.TimeCounter < 30) {
          this.timerStatus = 'normal';
        } else {
          this.isPulsating = false;
        }
        if (this.TimeCounter === 0) {
          this.stopTimer();

          if (this.attempt > 2) {
            this.timeOut('error');
          }
          if (this.attempt === 1) {
            this.stopTimer();
          }

          clearInterval(this.timerInterval);
          // Reset pulsating animation after the timer reaches 0
          this.isPulsating = false;
          resolve();
        } else {
          console.log(this.TimeCounter--);
        }
      }, 1000);
    });
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  async forceSubmit(questionId: any) {
    await this.stopTimer();
    this.isResultVisible = false;
    this.isAssesmentStarted = false;
    const userId = await this.auth.getIdFromToken();
    const companyId = 1;
    const Data = {
      assessmentUniqueId:
        this.assessmentUniqueId.assessmentUniqueId || this.assessmentUniqueId,
      assessmentStatus: 'Discarded',
      courseId: this.courseId,
      companyId: companyId,
      questionId,
    };
    console.log('onSubmit ==>', Data);
    await this.userService.saveAssessmentData(Data).subscribe((res: any) => {
      this.TimeCounter = 60;
    });
  }

  async submitFeedback() {
    const userId = await this.auth.getIdFromToken();
    const rating = this.ratingValue;
    const review = this.feedValue;
    const data = { rating, review, userId, videoId: this.videoId };
    console.log('feedback ==>', data);
    this.userService.saveFeedback(data).subscribe((res: any) => {
      console.log(data);
      this.isRatingVisible = !this.isRatingVisible;
      this.goBackToCourse();
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  async ngOnInit() {
    this.timerStatus = 'success';

    this.url.queryParams.subscribe((params) => {
      // Decrypt the parameters using the same encryption key
      const videoId = CryptoJS.AES.decrypt(
        params['index'],
        'encryptionKey'
      ).toString(CryptoJS.enc.Utf8);
      this.assessmentvideoId = videoId;
    });

    this.videoId = this.assessmentvideoId;
    console.log(this.videoId);

    this.userId = await this.authService.getIdFromToken();

    this.getAssesmentQuestions(this.videoId);
  }
}
