import {WebGL} from "webglmusti";

type Int32 = number;
type Float = number;

import Point2D = WebGL.Geometry.Base.Point2D;

class TopBar extends WebGL.Interface.InterfaceElement.InterfaceElement{
  min_height: Int32;
  constructor(width: Int32, height: Int32, min_height: Int32, max_height: Int32=0){
    super(0, 0, width, height);
    this.min_height = min_height;
  }
  //returns true height (after min/max adjustment) todo
  setHeight(height: Int32): Int32{
    this.height = height;

    return this.height;
  }
}

class WorkArea extends WebGL.Interface.InterfaceElement.InterfaceElement{
  constructor(y: Int32, width: Int32, height: Int32){
    super(0, y, width, height);
  }
  setY(y: Int32){
    const diff = y - this.y;
    this.y = y;
    this.height += diff;
  }
}

class PrimaryInterface{
  static min_top_bar_percent = 0.1;
  static top_bar_default = 0.2;
  static hover_pixels = 3;
  top_height: Int32;
  top_bar: TopBar;
  work_area: WorkArea;

  private global_mouse: Point2D;

  hover_resize: boolean;
  drag_resize: boolean;

  constructor(screen_width: Int32, screen_height: Int32){
    this.top_height = screen_height*PrimaryInterface.top_bar_default
    this.top_bar = new TopBar(screen_width, 
      this.top_height, 
      screen_height*PrimaryInterface.min_top_bar_percent
    );
    this.work_area = new WorkArea(this.top_height, screen_width, screen_height-this.top_height);
    this.global_mouse = new Point2D();
    this.hover_resize = false;
    this.drag_resize = false;
  }

  insideResizeTop(pt: Point2D): boolean{
    return pt.y >= this.top_height-PrimaryInterface.hover_pixels && pt.y <= this.top_height+PrimaryInterface.hover_pixels;
  }

  onMouseMove(pt: Point2D){
    this.global_mouse = pt;
    if(this.drag_resize){
      this.top_height = this.global_mouse.y;
      WebGL.WebGL.setCursor("grab");
    }
    else if(this.insideResizeTop(pt)){
      this.hover_resize = true;
      WebGL.WebGL.setCursor("ns-resize");
    }else{
      WebGL.WebGL.setCursor("default");
    }

  }
  onMouseDown(){
    if(this.hover_resize){
      this.drag_resize = true;
    }
  }
  onMouseUp(){
    this.drag_resize = false;
  }
  draw(vp: WebGL.Matrix.TransformationMatrix3x3, colour_shader: WebGL.Shader.MVPColourProgram, text_drawer: WebGL.TextDrawer){

  }
}

export class Engine extends WebGL.App.BaseEngine{
  interface: PrimaryInterface;
  constructor(w: Int32, h: Int32){
    super();
    this.interface = new PrimaryInterface(w, h);
  }

  protected handleKeyDown(ev: KeyboardEvent){};
  protected handleKeyUp(ev: KeyboardEvent){};
  protected handleMouseMove(ev: MouseEvent){
    const pt = new Point2D(ev.clientX, ev.clientY);
    this.interface.onMouseMove(pt);
  };
  protected handleMouseDown(ev: MouseEvent){
    this.interface.onMouseDown();
  };
  protected handleMouseUp(ev: MouseEvent){
    this.interface.onMouseUp();
  };
  protected handleScrollWheel(ev: WheelEvent){
  }
}