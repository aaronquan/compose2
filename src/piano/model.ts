import { WebGL } from "webglmusti";
import * as Note from "./../note/note";

type Int32 = number;
type Float = number;

const PianoOrientationEnum = WebGL.Geometry.Rotation.RotationEnum;

type PianoOrientation = WebGL.Geometry.Rotation.Rotation;


export class BasePianoModel{
  start_note: Note.Note;
  white_scale: Float; // thickness of generated note
  black_key_height_ratio: Float;
  black_key_width_ratio: Float;

  number_of_white_keys: Int32;
  number_of_black_keys: Int32;
  number_of_keys: Int32;


  bg: WebGL.BasicModelItem2D;

  black_key_fills: WebGL.BasicModel[];
  white_key_lines: WebGL.BasicModel;

  black_key_lines: WebGL.BasicModel[];

  white_key_highlight_models: WebGL.BasicModel;
  active_white_keys: Map<Int32, WebGL.Colour.ColourRGB>;
  active_black_keys: Set<Int32>;

  horizontal_lines: WebGL.BasicModel;

  is_generated: boolean;
  
  constructor(white_keys: Int32, starting_note: Note.Note=Note.NoteEnum.A, 
    black_key_width_ratio: Float=0.7, black_key_height_ratio: Float=0.6){
    this.start_note = starting_note;
    this.white_scale = 1/white_keys;
    this.number_of_white_keys = white_keys;

    const starting_note_tone = Note.RealNoteTone.getNoteToneFromNoteAndOctave(starting_note, Note.AccidentalEnum.None, 0);
    const ending_note_tone = starting_note_tone.getNoteWhiteNotesAbove(white_keys-1);

    //console.log(ending_note_tone.toString());
    this.number_of_black_keys = starting_note_tone.blackNotesBetween(ending_note_tone);
    this.number_of_keys = this.number_of_white_keys+this.number_of_black_keys;

    console.log(this.number_of_black_keys);
    console.log(this.number_of_white_keys);

    this.black_key_width_ratio = black_key_width_ratio;
    this.black_key_height_ratio = black_key_height_ratio;
    this.black_key_fills = [];
    this.bg = WebGL.BasicModel.defaultItem();
    this.white_key_lines = new WebGL.BasicModel();
    this.black_key_lines = [];

    this.white_key_highlight_models = new WebGL.BasicModel();
    this.active_white_keys = new Map();

    this.active_black_keys = new Set();

    this.horizontal_lines = new WebGL.BasicModel();

    this.is_generated = false;
  }

  generate(){
    const white = WebGL.Colour.ColourUtils.white();
    const black = WebGL.Colour.ColourUtils.black();
    const grey = WebGL.Colour.ColourUtils.grey();
    const block = WebGL.WebGL.rectangleModel(0, 0, 1, 1);
    this.bg = {colour: white, transformation: block};

    const white_scale = 1.0/this.number_of_white_keys;
    const line_scale = 0.20*white_scale;
    const half_line = line_scale*0.5;

    //vertical lines for white keys
    for(let i = 0; i < this.number_of_white_keys; i++){
      const x = i*white_scale - half_line;
      const line_model = WebGL.WebGL.rectangleModel(x, 0, line_scale, 1);
      const part = {colour: grey, transformation: line_model};
      this.white_key_lines.addPart(part);

      //white key models (for active keys)
      const key_model = WebGL.WebGL.rectangleModel(x, 0, white_scale, 1);
      this.white_key_highlight_models.addPart({colour: white, transformation: key_model});
    }

    const black_key_width = this.black_key_width_ratio*white_scale;
    const black_key_height = this.black_key_height_ratio;

    //black keys
    for(let i = 0; i < this.number_of_white_keys; i++){
      const note = (i+this.start_note) % 7 as Note.Note;
      const has_black_key = Note.RealNote.hasSharp(note) && i != 0;
      const black_line_model = new WebGL.BasicModel();
      const black_key_fill = new WebGL.BasicModel();

      if(has_black_key){
        //key fill
        const x = white_scale*i-(black_key_width/2);
        const b_key_model = WebGL.WebGL.rectangleModel(x, 0, black_key_width, black_key_height);
        const part = {colour: black, transformation: b_key_model};
        black_key_fill.addPart(part);

        /*
        //key border lines
        const vleft_key_model = WebGL.WebGL.rectangleModel(x-half_line, 0, line_scale, black_key_height);
        const vl_key_part = {colour: red, transformation: vleft_key_model};
        model.addPart(vl_key_part);
        black_line_model.addPart(vl_key_part);

        const vright_key_model = WebGL.WebGL.rectangleModel(x-half_line+black_key_width, 0, line_scale, black_key_height);
        const vr_key_part = {colour: blue, transformation: vright_key_model};
        model.addPart(vr_key_part);
        black_line_model.addPart(vr_key_part);

        // add line thickness for smooth border lines
        const vbot_key_model = WebGL.WebGL.rectangleModel(x-half_line, 0, black_key_width, line_scale);
        const vb_key_part = {colour: red, transformation: vbot_key_model};
        model.addPart(vb_key_part);
        black_line_model.addPart(vb_key_part);

        const vtop_key_model = WebGL.WebGL.rectangleModel(x-half_line, black_key_height, black_key_width, line_scale);
        const vt_key_part = {colour: red, transformation: vtop_key_model};
        model.addPart(vt_key_part);
        black_line_model.addPart(vt_key_part);
        */

        //piano_model.black_key_lines.push(black_line_model);
      }
      this.black_key_lines.push(black_line_model);
      this.black_key_fills.push(black_key_fill);
    }

    //horizontal lines
    const top_line_model = WebGL.WebGL.rectangleModel(0, 0, 1, half_line);
    const top_line_part = {colour: grey, transformation: top_line_model};
    this.horizontal_lines.addPart(top_line_part);

    const bot_line_model = WebGL.WebGL.rectangleModel(0, 1-half_line, 1, half_line);
    const bot_line_part = {colour: grey, transformation: bot_line_model};
    this.horizontal_lines.addPart(bot_line_part);

    this.is_generated = true;
  }

  drawKeySize(vp: WebGL.Matrix.TransformationMatrix3x3, x: Int32, y: Int32, key_width: Int32, key_height: Int32){
    const width = this.number_of_white_keys*key_width;
    const height = key_height;
    this.drawInRect(vp, x, y, width, height);
  }

  drawInRect(vp: WebGL.Matrix.TransformationMatrix3x3, x: Int32, y: Int32, width: Int32, height: Int32){
    const model = WebGL.WebGL.rectangleModel(x, y, width, height);
    const mvp = vp.multiplyCopy(model);
    this.draw(mvp);
  }

  draw(mvp: WebGL.Matrix.TransformationMatrix3x3){
    if(!this.is_generated){
      this.generate();
    }
    WebGL.BasicModel.drawItem(mvp, this.bg);
    for(const [id, colour] of this.active_white_keys){
      const model = this.white_key_highlight_models.parts[id];
      model.colour = colour;
      WebGL.BasicModel.drawItem(mvp, model);
    }
    this.white_key_lines.draw(mvp);
    for(const fill of this.black_key_fills){
      fill.draw(mvp);
    }
    for(const line of this.black_key_lines){
      line.draw(mvp);
    }

    this.horizontal_lines.draw(mvp);
  }
}