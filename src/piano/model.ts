import { WebGL } from "webglmusti";

type Int32 = number;
type Float = number;

const PianoOrientationEnum = WebGL.Geometry.Rotation.RotationEnum;

type PianoOrientation = WebGL.Geometry.Rotation.Rotation;


export class BasePianoModel{
  start_note: Note.Note;
  white_scale: Float; // thickness of generated note
  black_key_height_ratio: Double;
  black_key_width_ratio: Double;

  bg: WebGL.BasicModelItem2D;

  black_key_fills: WebGL.BasicModel[];
  white_key_lines: WebGL.BasicModel;

  black_key_lines: WebGL.BasicModel[];

  white_key_highlight_models: WebGL.BasicModel;
  active_white_keys: Map<Int32, WebGL.Colour.ColourRGB>;
  active_black_keys: Set<Int32>;

  horizontal_lines: WebGL.BasicModel;


}