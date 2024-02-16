import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MediaService } from 'src/app/services/media.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

export let browserRefresh = false;
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'in',
        style({
          opacity: 1,
          color: 'white', // Change to the desired color
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
          color: 'transparent', // Change to the desired color
        })
      ),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CourseDetailsComponent {
  private themeSubscription!: Subscription;
  isDarkTheme!: boolean;
  courseCompleted: boolean = false;
  dayVideoArray = [
    {
      src: 'assets/videos/Ship%20Headon/SA_Headon_BridgeCamera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%20Headon/SA_Headon_Binoculars(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%20Headon/Ship_Approaching_Headon_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/Aft_Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/HeadOn_Radar%20Lvl%2001.png',
      Ecdis: 'assets/videos/Radarimages/HeadOn_ECDIS%20Lvl%2001.png',
      videotitle: 'Level 01',
      index: 1,
      progress: 0,
      progressPercentage: 0,
      isDisabled: false,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/Ship%20Headon_Nightime/NT_Ship_Approaching_Headon_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%20Headon_Nightime/NT_Ship_Approaching_Binoculars(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%20Headon_Nightime/NT_SA_Headon_Monkey%20Island(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/NT_Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Starboard_Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Aft%20Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/HeadOn_Radar%20Lvl%2001.png',
      Ecdis: 'assets/videos/Radarimages/HeadOn_ECDIS%20Lvl%2001.png',
      videotitle: 'Level 02',
      index: 2,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },

    {
      src: 'assets/videos/Ship%2045_STB/SA_45%C2%B0_STB_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2045_STB/SA_45%C2%B0_STB_Binoculars(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2045_STB/SA_45%C2%B0_STB_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/Aft_Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/STB45_Radar%20Lvl%2004.png',
      Ecdis: 'assets/videos/Radarimages/STB45_ECDIS%20Lvl%2004.png',
      videotitle: 'Level 03',
      index: 3,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/Ship%2045%C2%B0_STB%20Nightime/SA_45%C2%B0_STB_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2045%C2%B0_STB%20Nightime/SA_45%C2%B0_STB_Binocular(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2045%C2%B0_STB%20Nightime/SA_45%C2%B0_STB_Monkey%20Island%20Camera(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/NT_Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Starboard_Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Aft%20Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/STB45_Radar%20Lvl%2004.png',
      Ecdis: 'assets/videos/Radarimages/STB45_ECDIS%20Lvl%2004.png',
      videotitle: 'Level 04',
      index: 4,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },

    {
      src: 'assets/videos/Ship%2045_Port/SA_45%C2%B0Port_Bridge%20Camera(WithAudio).mp4',
      videotitle: 'Level 05',
      index: 5,
      zoomvideo:
        'assets/videos/Ship%2045_Port/SA_45%C2%B0Port_Binoculars(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2045_Port/SA_45%C2%B0Port_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/Aft_Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/Port45_Radar%20Lvl%2005.png',
      Ecdis: 'assets/videos/Radarimages/Port45_ECDIS%20Lvl%2005.png',
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/Ship%2045_Port_Nightime/NT_SA_45%C2%B0_Port_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2045_Port_Nightime/NT_SA_45%C2%B0_Port_Binoculars(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2045_Port_Nightime/NT_SA_45%C2%B0_Port_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Cam%20with%20empty%20Ocean/NT_Port_Camera(WithAudio).mp4',
      right:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Starboard_Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Aft%20Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/Port45_Radar%20Lvl%2005.png',
      Ecdis: 'assets/videos/Radarimages/Port45_ECDIS%20Lvl%2005.png',
      videotitle: 'Level 06',
      index: 6,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },

    {
      src: 'assets/videos/Ship%2090_STB_/Ship_Approaching_STB_90%C2%B0_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2090_STB_/SA_STB_90%C2%B0_Binocular(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2090_STB_/SA_STB_90%C2%B0_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Ship%2090_STB_/Ship_Approaching_STB_90%C2%B0_Port%20Camera(WithAudio).mp4',
      right:
        'assets/videos/Ship%2090_STB_/Ship_Approaching_STB_90%C2%B0_Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/Aft_Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/STB90_Radar%20Lvl%2002.png',
      Ecdis: 'assets/videos/Radarimages/STB90_ECDIS%20Lvl%2002.png',
      videotitle: 'Level 07',
      index: 7,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/Ship%2090_STB_Nightime/NT_SA_STB_90%C2%B0_BridgeCamera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2090_STB_Nightime/NT_SA_STB_90%C2%B0Binocular(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2090_STB_Nightime/NT_SA_STB_90%C2%B0_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Ship%2090_STB_Nightime/NT_SA_STB_90%C2%B0_PortCamera(WithAudio).mp4',
      right:
        'assets/videos/Ship%2090_STB_Nightime/NT_SA_STB_90%C2%B0_StarboardCamera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Aft%20Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/STB90_Radar%20Lvl%2002.png',
      Ecdis: 'assets/videos/Radarimages/STB90_ECDIS%20Lvl%2002.png',
      videotitle: 'Level 08',
      index: 8,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },

    {
      src: 'assets/videos/Ship%2090_Port/SA_Port_90%C2%B0_Bridge%20Camera(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2090_Port/SA_90%C2%B0_Port_Binocular(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2090_Port/SA_Port_90%C2%B0_Monkey%20Island(WithAudio).mp4',
      left: 'assets/videos/Ship%2090_Port/SA_Port_90%C2%B0_Port%20Camera(WithAudio).mp4',
      right:
        'assets/videos/Ship%2090_Port/SA_Port_90%C2%B0_Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/Aft_Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/Port90_Radar%20Lvl%2003.png',
      Ecdis: 'assets/videos/Radarimages/Port90_ECDIS%20Lvl%2003.png',
      videotitle: 'Level 09',
      index: 9,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
    {
      src: 'assets/videos/Ship%2090_Port_Nightime/NT_Ship_Approaching_Port_90%C2%B0_Bridge%20Camera.(WithAudio).mp4',
      zoomvideo:
        'assets/videos/Ship%2090_Port_Nightime/NT_SA_Port_Binocular(WithAudio).mp4',
      monkeyIsland:
        'assets/videos/Ship%2090_Port_Nightime/NT_Ship_Approaching_Port_90%C2%B0_MonkeyIsland(WithAudio).mp4',
      left: 'assets/videos/Ship%2090_Port_Nightime/NT_Ship_Approaching_Port_90%C2%B0_Port%20Camera(WithAudio).mp4',
      right:
        'assets/videos/Ship%2090_Port_Nightime/NT_Ship_Approaching_Port_90%C2%B0_Starboard%20Camera(WithAudio).mp4',
      backcamera:
        'assets/videos/Cam%20with%20empty%20Ocean/NT_Aft%20Camera(WithAudio).mp4',
      Radar: 'assets/videos/Radarimages/Port90_Radar%20Lvl%2003.png',
      Ecdis: 'assets/videos/Radarimages/Port90_ECDIS%20Lvl%2003.png',
      videotitle: 'Level 10',
      index: 10,
      progress: 0,
      progressPercentage: 0,
      isDisabled: true,
      isAssessmentCompleted: false,
    },
  ];

  isObjectiveVisible = false;
  index1 = false;
  index2 = false;
  index3 = false;
  index4 = false;
  index5 = false;
  index6 = false;
  index7 = false;

  objective() {
    this.buttonClickSound.play();

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.pause();
    this.isObjectiveVisible = true;
    let docElement = document.documentElement;
    docElement.requestFullscreen();

    if (this.currentVideoIndex === 1) {
      this.index1 = true;
    } else if (this.currentVideoIndex === 2) {
      this.index2 = true;
    } else if (this.currentVideoIndex === 3) {
      this.index3 = true;
    } else if (this.currentVideoIndex === 4) {
      this.index4 = true;
    } else if (this.currentVideoIndex === 5) {
      this.index5 = true;
    } else if (this.currentVideoIndex === 6) {
      this.index6 = true;
    }
  }

  closeobjectivemodal() {
    this.isObjectiveVisible = false;
    document.exitFullscreen();
    this.buttonClickSound.play();

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    videoElement.load(); // Load the original video

    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = this.currentVideoTime;
      videoElement.play(); // Start playing from the stored currentTime
    });
  }
  currentVideoIndex: any; // Initial index
  isHovered = false;
  private inactivityTimer: any; // Timer to track inactivity
  userId: any;
  courseId: any;
  isVideoPlaying: boolean = false;
  buttonClickSound = new Audio();

  // Add a property to store the original video source
  originalVideoSrc = 'assets/videos/video1.mp4';

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<any>;
  currentVideoTime!: any;
  radarImage: any;
  subscription!: Subscription;

  constructor(
    private api: VgApiService,
    private auth: AuthService,
    private mediaService: MediaService,
    private message: NzMessageService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.buttonClickSound.src =
      'assets/sounds/Smart_UI_Interface_Melodic_Bass_Tonal_03_Stock_Sine_Blimp.wav';
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;

        if (this.isVideoPlaying) {
          this.saveVideoProgress();
        }
      }
    });
  }

  // Function to handle mouse enter event
  onMouseEnter() {
    this.isHovered = true;
    this.resetInactivityTimer();
  }

  // Function to handle mouse leave event
  onMouseLeave() {
    this.isHovered = false;
    this.resetInactivityTimer();
  }

  // Function to reset the inactivity timer
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);

    // Set a timeout to hide controls after 4 seconds of inactivity
    this.inactivityTimer = setTimeout(() => {
      this.isHovered = false;
    }, 3000);
  }

  // Listen to mousemove event to reset hover state
  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    this.onMouseEnter();
  }

  // Function to handle zoom in
  isZoomin = true;
  isZoomout = false;
  isgoback = false;
  isradarvisible = false;
  isMainVideoPlaying: Boolean = true;

  loadVideo(videoData: any) {
    let videoSource: any;
    this.showRewatchandAssessment = false;
    this.showVideo = true;
    this.currentVideoIndex = videoData.index;
    videoSource = videoData.src;
    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;

      console.log(videoSource);
      videoElement.src = videoSource;
      videoElement.load();
      videoElement.addEventListener('loadeddata', () => {
        if (videoData.progressPercentage !== 100) {
          videoElement.currentTime = videoData.progress; // Start playing from the beginning
        }
        videoElement.play(); // Start playing the new video
      });

      // You can add other event listeners or actions here if needed
      videoElement.addEventListener('playing', () => {
        this.isVideoPlaying = true;
      });
    });
  }

  playSelectedVideo(videoData: any) {
    this.isradarvisible = false;
    this.showVideo = true;

    let videoSource = videoData.src;
    this.showRewatchandAssessment = false;
    this.isZoomin = true;
    this.isZoomout = false;
    this.isgoback = false;
    this.isMainVideoPlaying = true;

    this.currentVideoIndex = videoData.index;
    setTimeout(async () => {
      const videoElement = await this.videoPlayer.nativeElement;

      videoElement.src = '';

      console.log(videoSource);
      videoElement.src = videoSource;

      videoElement.load();
      videoElement.addEventListener('loadeddata', () => {
        videoElement.currentTime = 0; // Start playing from the beginning

        videoElement.play(); // Start playing the new video
      });

      // You can add other event listeners or actions here if needed
      videoElement.addEventListener('playing', () => {
        this.isVideoPlaying = true;
      });
    }, 100);
  }

  zoomIn() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = true;
    this.isgoback = false;
    this.isMainVideoPlaying = false;
    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;
    let videoSource = '';
    videoElement.src = '';

    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.zoomvideo;
      }
    });

    console.log('zoommvideo', videoSource);
    videoElement.src = videoSource;
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  // Function to handle zoom out
  zoomOut() {
    this.buttonClickSound.play();

    this.isZoomin = true;
    this.isZoomout = false;
    this.isMainVideoPlaying = true;

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;

    videoElement.currentTime = this.currentVideoTime;

    let videoSource = '';
    videoElement.src = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.src;
      }
    });
    // Change the video source back to the original video
    videoElement.src = videoSource;

    videoElement.load(); // Load the original video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = this.currentVideoTime;
      videoElement.play(); // Start playing from the stored currentTime
    });
  }

  goback() {
    this.buttonClickSound.play();

    this.isZoomin = true;
    this.isZoomout = false;
    this.isgoback = false;
    this.isradarvisible = false;
    this.isMainVideoPlaying = true;

    setTimeout(() => {
      const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
      videoElement.currentTime = this.currentVideoTime;

      videoElement.src = '';

      let videoSource = '';

      this.dayVideoArray.map((item: any) => {
        if (this.currentVideoIndex === item.index) {
          videoSource = item.src;
        }
      });
      // Change the video source back to the original video
      videoElement.src = videoSource;

      videoElement.load(); // Load the original video

      // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
      videoElement.addEventListener('loadeddata', () => {
        videoElement.currentTime = this.currentVideoTime;
        videoElement.play(); // Start playing from the stored currentTime
      });
    });
  }

  Leftvideo() {
    // const textToSpeak = 'Port Side View'; // Modify this with your desired text

    // Speak out the text
    // if ('speechSynthesis' in window) {
    //   const synth = window.speechSynthesis;
    //   // const utterance = new SpeechSynthesisUtterance(textToSpeak);
    //   synth.speak(utterance);
    // } else {
    //   console.error('Speech synthesis not supported');
    // }
    this.buttonClickSound.play();

    // Your existing code below...
    this.isZoomin = false;
    this.isZoomout = false;
    this.isgoback = true;
    this.isMainVideoPlaying = false;

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = '';

    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.left;
      }
    });
    console.log('zoommvideo', videoSource);
    videoElement.src = videoSource;
    videoElement.load();

    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0;
      videoElement.play();
    });
  }

  backviewcamera() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = false;
    this.isgoback = true;
    this.isMainVideoPlaying = false;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = '';

    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.backcamera;
      }
    });

    console.log('zoommvideo', videoSource);
    videoElement.src = videoSource;
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  rightvideo() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = false;
    this.isgoback = true;
    this.isMainVideoPlaying = false;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = '';

    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.right;
      }
    });

    console.log('zoommvideo', videoSource);
    videoElement.src = videoSource;
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  monkeyview() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = false;
    this.isgoback = true;
    this.isMainVideoPlaying = false;

    // Change the video source to the new video
    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;

    videoElement.src = '';

    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.monkeyIsland;
      }
    });
    console.log('zoommvideo', videoSource);
    videoElement.src = videoSource;
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  Radar() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = false;
    this.isMainVideoPlaying = false;

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;
    let videoSource = '';

    videoElement.src = '';

    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        this.radarImage = item.Radar;
      }
    });
    console.log(this.radarImage);
    videoElement.load();

    // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    this.isgoback = true;
    this.isradarvisible = true;
  }

  ecdis() {
    this.buttonClickSound.play();

    this.isZoomin = false;
    this.isZoomout = false;
    this.isMainVideoPlaying = false;

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;
    videoElement.src = '';

    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        this.radarImage = item.Ecdis;
      }
    });
    console.log(this.radarImage);
    videoElement.load();

    // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    this.isgoback = true;
    this.isradarvisible = true;
  }

  showVideo: Boolean = true;
  showRewatchandAssessment: boolean = false;

  onPlayerReady(source: VgApiService) {
    this.api = source;
    console.log('onPlayerReady');

    // this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
    //   this.isVideoPlaying = false;
    //   this.showVideo = false;
    //   this.showRewatchandAssessment = true;
    //   this.isVideoPlaying = false;

    //   this.saveVideoProgress();
    // });
  }

  onVideoEnded() {
    if (this.isMainVideoPlaying) {
      this.isVideoPlaying = false;
      this.showVideo = false;
      this.showRewatchandAssessment = true;
      this.isVideoPlaying = false;

      this.saveVideoProgress();
    } else {
      this.goback();
    }
  }

  // currentProgress: any = 0;

  // // Method to update the progress
  // updateProgress(currentTime: number) {
  //   const videoElement = this.videoPlayer.nativeElement;

  //   const duration = videoElement.duration;
  //   if (duration > 0) {
  //     this.currentProgress = ((currentTime / duration) * 100).toFixed(0);
  //   }
  // }

  saveVideoProgress() {
    const videoElement = this.videoPlayer.nativeElement;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    if (!isNaN(duration)) {
      const progressPercentage = ((currentTime / duration) * 100).toFixed();
      console.log('currentTime', currentTime);
      console.log('duration', duration);
      console.log(progressPercentage);

      const data = {
        userId: this.userId,
        courseId: 1,
        videoId: this.currentVideoIndex, // Adding 1 to convert from zero-based index
        progress: currentTime,
        videoDuration: duration,
        progressPercentage: progressPercentage,
      };

      console.log('Video Progress Data:', data);
      this.mediaService.saveVideoProgress(data).subscribe((res: any) => {
        const itemIndex = this.dayVideoArray.findIndex(
          (item: any) => item.index === this.currentVideoIndex
        );

        console.log(itemIndex);
        if (itemIndex !== -1) {
          this.dayVideoArray[itemIndex].progressPercentage =
            parseInt(progressPercentage);

          this.dayVideoArray[itemIndex].isDisabled = false;
        }

        if (res.success === true) {
          this.message.success('Video Progress Saved Successfully!');
          this.courseCompleted = true;
        }
      });

      // Now, you can use the 'data' object to save the progress to your backend or wherever needed.
    }
  }

  videoContent: any;
  onPageLoaded: Boolean = true;

  fetchvideoprogress() {
    this.mediaService
      .fetchVideoprogress(this.courseId, this.userId)
      .subscribe((res: any) => {
        console.log(res);

        // Add Progress to video Array
        this.dayVideoArray.forEach((video) => {
          const matchingProgress = res.find(
            (item: any) => item.videoId === video.index
          );
          if (matchingProgress) {
            video.progress = matchingProgress.progress;
            video.progressPercentage = matchingProgress.progressPercentage;
            video.isAssessmentCompleted =
              matchingProgress.isAssessmentCompleted;
          }
        });

        // Should the Video be Disabled
        this.dayVideoArray.map((item: any, index: any, array: any) => {
          if (item.index === 1) {
            item.isDisabled = false;
          } else {
            const previousItem = array[index - 1];
            if (
              previousItem.progressPercentage === 100 &&
              previousItem.isAssessmentCompleted
            ) {
              item.isDisabled = false;
            }
          }
        });

        //what should be be played :)
        if (this.onPageLoaded) {
          let itemFound = false; // Initialize a flag to track if an item is found
          this.dayVideoArray.some((item: any, index: any) => {
            if (item.progressPercentage !== 100) {
              this.currentVideoIndex = item.index;
              this.loadVideo(item);
              itemFound = true;
              return true; // Exit the loop when an item is found
            } else if (
              item.progressPercentage === 100 &&
              !item.isAssessmentCompleted
            ) {
              this.currentVideoIndex = item.index;
              this.showRewatchandAssessment = true;
              this.showVideo = false;
              itemFound = true;
              return true;
            } else {
              return false;
            }
          });

          if (!itemFound) {
            this.message.success('Congratulations your course is Completed!');
            let videoSource: any;

            this.showVideo = true;
            this.currentVideoIndex = 1;
            videoSource = this.dayVideoArray[0].src;
            setTimeout(() => {
              const videoElement = this.videoPlayer.nativeElement;

              console.log(videoSource);
              videoElement.src = videoSource;
              videoElement.load();
              videoElement.addEventListener('loadeddata', () => {
                videoElement.currentTime = 0; // Start playing from the beginning

                videoElement.play(); // Start playing the new video
              });

              // You can add other event listeners or actions here if needed
              videoElement.addEventListener('playing', () => {
                this.isVideoPlaying = true;
              });
            });
          }
        }

        console.log('dayVideoArray', this.dayVideoArray);
      });
  }

  rewatchVideo() {
    this.showVideo = true;
    this.showRewatchandAssessment = false;
    this.isVideoPlaying = true;

    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;
      let videoSource;
      this.dayVideoArray.map((item: any) => {
        if (this.currentVideoIndex === item.index) {
          videoSource = item.src;
        }
      });

      videoElement.src = videoSource;
      videoElement.load();
      videoElement.addEventListener('loadeddata', () => {
        videoElement.currentTime = 0;
        videoElement.play(); // Start playing from the stored currentTime
      });
    });
  }

  StartAssesment() {
    const encryptedCourseId = CryptoJS.AES.encrypt(
      this.currentVideoIndex.toString(),
      'encryptionKey'
    ).toString();
    this.router.navigate([`user/assesments`], {
      queryParams: { index: encryptedCourseId },
    });
  }

  getVideoProgress() {
    const videoElement = this.videoPlayer.nativeElement;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    if (!isNaN(duration)) {
      const progressPercentage = (currentTime / duration) * 100;
      console.log(
        'Current Video Progress:',
        progressPercentage.toFixed() + '%'
      );
    }
  }

  playNextVideo() {
    this.showRewatchandAssessment = false;
    this.showVideo = true;
    setTimeout(() => {
      const videoElement = this.videoPlayer.nativeElement;

      if (this.currentVideoIndex < this.dayVideoArray.length - 1) {
        this.currentVideoIndex++;
        videoElement.src = this.dayVideoArray[this.currentVideoIndex].src;
        videoElement.load();
      } else {
        // Handle the case when there are no more videos
        console.log('No more videos');
      }
      videoElement.play();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme().then();

    const videoElement: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.currentVideoTime = videoElement.currentTime;
    let videoSource = '';
    this.dayVideoArray.map((item: any) => {
      if (this.currentVideoIndex === item.index) {
        videoSource = item.src;
      }
    });

    videoElement.src = videoSource;
    videoElement.load(); // Load the new video

    // Use 'loadeddata' event to ensure metadata is loaded before setting currentTime
    videoElement.addEventListener('loadeddata', () => {
      videoElement.currentTime = 0; // Start playing from the beginning
      videoElement.play(); // Start playing the new video
    });
  }

  //just uncomment this to save progress on leaving
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   // Your code here to handle the refresh event
  //   this.saveVideoProgress();
  //   $event.returnValue = null; // This line will display a confirmation dialog to the user
  // }

  // Listen to video player events to reset inactivity timer
  ngAfterViewInit() {
    this.videoPlayer.nativeElement.addEventListener('click', () => {
      this.resetInactivityTimer();
    });

    // Add other events you want to listen for, e.g., play, pause, etc.
  }

  async ngOnInit(): Promise<void> {
    this.courseId = 1;
    this.userId = await this.auth.getIdFromToken();
    this.fetchvideoprogress();

    const currentTheme = this.themeService.getSavedTheme();
    this.themeSubscription = this.themeService
      .isDarkThemeObservable()
      .subscribe((isDark: boolean) => {
        this.isDarkTheme = isDark;
      });

    // this.loadVideo();
    console.log('userid', this.userId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
