import {WebGL} from "webglmusti";
import { Engine } from "./engine";

import * as Note from "./note/note";
import * as PianoModel from "./piano/model";

type Int32 = number;

export class Renderer extends WebGL.App.SimpleAppRenderer<Engine>{
  colour_shader: WebGL.Shader.MVPColourProgram;

  piano_model: PianoModel.BasePianoModel;

  constructor(w: Int32, h: Int32){
    super(w, h);
    this.colour_shader = new WebGL.Shader.MVPColourProgram();
    this.piano_model = new PianoModel.BasePianoModel(10, Note.NoteEnum.C);
    //PianoModel.BasePianoModel.generateModel(10, Note.NoteEnum.C);
  }
  render(engine: Engine){
    WebGL.WebGL.drawColourRect(this.orthographic, this.colour_shader, 10, 10, 20, 20, WebGL.Colour.ColourUtils.white());


    this.piano_model.drawKeySize(this.orthographic, 100, 100, 15, 50);
    
  }
}