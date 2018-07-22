
export class WebWorker {
    dataObj: string;
    blob: Blob;
    blobURL: string;
   constructor() {
       this.createWorker();
   }
   workerFunction() {
       self.onmessage = function(e) {
           console.log('worker received message', e.data);
           let x = 0;
           for (let i = 0; i < 2000000000; i++) {
             x = x + i;
           }
           const num = (Date.now() - e.data) / 1000;
           self.postMessage(num);
       };
    }
   createWorker() {
    this.dataObj = '(' + this.workerFunction + ')() ;';
    this.blob = new Blob([this.dataObj]);
    this.blobURL = window.URL.createObjectURL(this.blob);
   }
}
