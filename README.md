# easel
A javascript utility library that helps setup and manage a 2d canvas

## Setup
Getting started is as easy as `npm i @ion-cloud/easel`. After that you're ready to start importing it into your code. The actual setup is really just one line of code. Here we set easel up and draw text in the center of the screen.
```
import {Easel} from 'ion-cloud';

const easel = new Easel(); //this initializes the library and creates easel

// now lets draw something on the canvas
easel.ctx.textAlign='center';
easel.ctx.fillStyle='#f00';
easel.ctx.fillText('This text is in the center of the screen.',easel.viewport.w/2,easel.viewport.h/2);
```
If you want to run code every time the window is resized you can attribute it to the `config` function.
```
easel.config = ()=>{

  // inside this function we'll have an updated value for the viewport
  console.log(easel.viewport);
};
```
It's common in games to have a draw loop for things like animations. Easel provides a simple way of accomplishing this.
```
easel.onDraw = function main(){
  // draw stuff in here
  requestAnimationFrame(main); //use browser function to acquire best time to loop
};
easel.redraw(); //initiate a draw causing the main loop.
```
