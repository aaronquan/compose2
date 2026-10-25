import {WebGL} from "webglmusti";
import { Engine } from "./engine";

type Int32 = number;

export class Renderer extends WebGL.App.SimpleAppRenderer<Engine>{
  colour_shader: WebGL.Shader.MVPColourProgram;
  constructor(w: Int32, h: Int32){
    super(w, h);
    this.colour_shader = new WebGL.Shader.MVPColourProgram();
  }
  render(engine: Engine){
    WebGL.WebGL.drawColourRect(this.orthographic, this.colour_shader, 10, 10, 20, 20, WebGL.Colour.ColourUtils.white());
  }
}