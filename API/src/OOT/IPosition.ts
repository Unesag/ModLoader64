export interface IPosition {
  x: number;
  y: number;
  z: number;
  getRawPos(): Buffer;
}
