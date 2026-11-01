import {WebGL} from "webglmusti";
import { Engine } from "./engine";
import { Renderer } from "./renderer";

export function createApp(canvas: HTMLCanvasElement): WebGL.App.App<Engine>{
  const engine = new Engine(canvas.clientWidth, canvas.clientHeight);
  const renderer = new Renderer(canvas.clientWidth, canvas.clientHeight);
  return new WebGL.App.App(engine, renderer);
}
