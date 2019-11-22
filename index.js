export class Easel{
  constructor(context='2d'){
    if(!!window.CanvasRenderingContext2D){
      this.activated = true;
    }else{
      this.activated = false;
      return false;
    } //end if
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext(context);
    this.viewport = this.acquireViewport();
    window.onresize = ()=>{
      this.viewport = this.acquireViewport();
      this.resizeCanvas();
      this.config();
      this.redraw();
    };
    this.background = '#000';
    this.started = false;
    document.body.appendChild(this.canvas);

    let d = document.createElement('style');
    d.type = 'text/css';
    d.rel = 'stylesheet';
    d.innerHTML =
      `body{background-color:${this.background};margin:0;}
      canvas{position:fixed;left:0;top:0;right:0;bottom:0}`;
    document.querySelector('head').appendChild(d);
    this.resizeCanvas();
  }
  resizeCanvas(){
    const dpi = window.devicePixelRatio||1;

    this.canvas.style.width = `${this.viewport.w}px`;
    this.canvas.style.height = `${this.viewport.h}px`;
    this.canvas.width = this.viewport.w*dpi;
    this.canvas.height = this.viewport.h*dpi;
    this.ctx.scale(dpi);
  }
  acquireContext(){
    this.ctx = this.canvas.getContext('2d');
  }
  acquireViewport(){
    let d = window, b = 'inner';

    if(!(d.innerWidth)){
      b = 'client';
      d = document.documentElement || document.body;
    } //end if
    return {
      w: d[b + 'Width'],
      h: d[b + 'Height']
    };
  }
  redraw(){
    if(!this.started){
      this.config();
      this.started=true;
    } //end if
    this.onDraw();
  }
  config(){}
  onDraw(){
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height);
  }
}
export class Easel3d extends Easel{
  constructor(){
    super('webgl');
  }
}

