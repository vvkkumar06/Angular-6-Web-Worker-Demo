import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { WebWorker } from './worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  worker: Worker;
  webWorker: WebWorker;
  count: any = 0;
  num: any = 0;
  usersTime: any = 0;
  loadingText: Number = 0;
  @ViewChild('user') user: ElementRef;

  constructor(private renderer: Renderer2) { }
  ngOnInit() {
    this.webWorker = new WebWorker();
  }
  startWork() {
    const time = Date.now();
    fetch(`https://randomuser.me/api`)
      .then(data => data.json())
      .then(data => {
        console.log(data);
        this.count++;
        this.createNewUser(data);
        if (this.count >= 24) {
          return false;
        }
        this.loadingText = (Date.now() - time) / 1000;
        this.usersTime += this.loadingText;
        this.startWork();
      });
  }
  startWithWorker() {
    this.initWebWorker();
  }
  initWebWorker() {
    this.worker = new Worker(this.webWorker.blobURL);
    const start = Date.now(); // milliseconds
    this.worker.postMessage(start);
    this.worker.onmessage = (e) => {
      console.log('main-thread', e.data);
      this.num = e.data;
    };
  }

  createNewUser(data) {
      const user = data.results[0];
      const newUser = this.renderer.createElement('div');
      newUser.classList.add('w3-card-4');
      const image = this.renderer.createElement('img');
      image.style.width = '100%';
      const name = this.renderer.createElement('p');
      name.style.fontSize = '12px';
      const nameData = user.name;
      name.innerHTML = `${nameData.title} ${nameData.first} ${nameData.last}`;
      image.src = user.picture.thumbnail;
      this.renderer.appendChild(newUser, image);
      this.renderer.appendChild(newUser, name);
      this.renderer.appendChild(this.user.nativeElement, newUser);
  }
  startWithoutWorker() {
    const start = Date.now(); // milliseconds
    let x = 0;
    for (let i = 0; i < 2000000000; i++) {
      x = x + i;
    }
    this.num = (Date.now() - start) / 1000;
  }
}
