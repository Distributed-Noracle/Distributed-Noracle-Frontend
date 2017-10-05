export class DrawUtil {
  public static getColorCodeForValueInScale(value: number, min: number, max: number): string {
    const med = (min + max) / 2;
    if (value > med) {
      return '#00' + Math.round(255 * (value - med) / (max - med)).toString(16) + '00';
    } else if (value < med) {
      return '#' + Math.round(255 * (med - value) / (med - min)).toString(16) + '0000';
    } else {
      return '#000';
    }
  }
}
