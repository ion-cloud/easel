function debounce(callback, wait) {
  let timeout = null ;

  return function() {
    const next = () => callback.apply(this, arguments)

    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
  };
} //end debounce()

export class EaselWebGL{
  constructor(){
    if(!!window.CanvasRenderingContext2D){
      this.activated = true;
    }else{
      this.activated = false;
      return false;
    } //end if
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('webgl');
    this.viewport = this.acquireViewport();
    window.onresize = debounce(()=>{
      this.viewport = this.acquireViewport();
      this.resizeCanvas();
      this.config();
      this.redraw();
    },300);
    this.background = '#000';
    document.body.appendChild(this.canvas);
    let stylesheet = document.createElement('style');

    stylesheet.type = 'text/css';
    stylesheet.rel = 'stylesheet';
    stylesheet.innerHTML = `
      body{background-color:#000;margin:0}
      canvas{position:fixed;left:0;top:0;right:0;bottom:0}
    `;
    document.querySelector('head').appendChild(stylesheet);
    this.resizeCanvas();
    this.ctx.clearColor(0.2,0.5,0,1);
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    this.vertexCode = `
      attribute vec2 aVertexPosition;

      void main() {
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);
      }
    `;
    this.vertexShader = this.ctx.createShader(this.ctx.VERTEX_SHADER);
    this.fragmentCode = `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform vec4 uColor;

      void main() {
        gl_FragColor = uColor;
      }
    `;
    this.fragmentShader = this.ctx.createShader(this.ctx.FRAGMENT_SHADER);
    this.ctx.shaderSource(this.vertexShader, this.vertexCode);
    this.ctx.compileShader(this.vertexShader);
    this.ctx.shaderSource(this.fragmentShader, this.fragmentCode);
    this.ctx.compileShader(this.fragmentShader);
    this.program = this.ctx.createProgram();
    this.ctx.attachShader(this.program, this.vertexShader);
    this.ctx.attachShader(this.program, this.fragmentShader);
    this.ctx.linkProgram(this.program);
    if(!this.ctx.getShaderParameter(this.vertexShader, this.ctx.COMPILE_STATUS)){
      console.log(this.ctx.getShaderInfoLog(this.vertexShader));
    } //end if
    if(!this.ctx.getShaderParameter(this.fragmentShader, this.ctx.COMPILE_STATUS)){
      console.log(this.ctx.getShaderInfoLog(this.fragmentShader));
    } //end if
    if(!this.ctx.getProgramParameter(this.program, this.ctx.LINK_STATUS)){
      console.log(this.ctx.getProgramInfoLog(this.program));
    } //end if
    this.ctx.useProgram(this.program); 
  }
  resizeCanvas(){
    const dpi = window.devicePixelRatio||1;

    this.canvas.style.width = `${this.viewport.w}px`;
    this.canvas.style.height = `${this.viewport.h}px`;
    this.canvas.width = this.viewport.w*dpi;
    this.canvas.height = this.viewport.h*dpi;
    this.ctx.viewport(0,0,this.viewport.w*dpi, this.viewport.h*dpi);
  }
  acquireContext(){
    this.ctx = this.canvas.getContext('webgl');
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
      this.started = true;
    } //end if
    this.onDraw();
  }
  config(){}
  onDraw(){
    this.fillRect({x:0,y:0,w:1,h:1});
  }
  fillRect({x,y,w,h,c=[0.0,1.0,0.0,1.0]}={}){
    const x1 = x*2-1,
          y1 = (y*2-1)*-1,
          x2 = x*2-1+w*2,
          y2 = (y*2-1+h*2)*-1,
          vertices = new Float32Array([
            //triangle 1
            x1, y2, //bottom-left
            x2, y2, //bottom-right
            x2, y1, //top-right

            //triangle 2
            x1, y2, //bottom-left
            x2, y1, //top-right
            x1, y1 //top-left
          ]),
          verticeBuffer = this.ctx.createBuffer();

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, verticeBuffer);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, vertices, this.ctx.STATIC_DRAW);
    const itemSize = 2,
          numItems = vertices.length / 2;
    this.program.uColor = this.ctx.getUniformLocation(this.program, 'uColor');
    this.ctx.uniform4fv(this.program.uColor, c);
    this.program.aVertexPosition = this.ctx.getAttribLocation(this.program, 'aVertexPosition');
    this.ctx.enableVertexAttribArray(this.program.aVertexPosition);
    this.ctx.vertexAttribPointer(this.program.aVertexPosition, itemSize, this.ctx.FLOAT, false, 0, 0);
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, numItems);
  }
}
export class Easel{
  constructor(context='2d'){
    this.context = context;
    if(!!window.CanvasRenderingContext2D){
      this.activated = true;
    }else{
      this.activated = false;
      return false;
    } //end if
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext(context);
    this.viewport = this.acquireViewport();
    window.onresize = debounce(()=>{
      this.viewport = this.acquireViewport();
      this.resizeCanvas();
      this.config();
      this.redraw();
    },300);
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
    this.ctx.scale(dpi,dpi);
  }
  acquireContext(){
    this.ctx = this.canvas.getContext(this.context);
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
