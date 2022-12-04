import { Pipe, PipeTransform } from '@angular/core';
import { ConstApi } from '../utils/const-api';

@Pipe({
  name: 'cutText'
})
export class CutTextPipe implements PipeTransform {

  transform(value: string | undefined, ...args: number[]): string | undefined {
    const lenght = this.getParam(args);

    return value && value.length >= lenght ? value.substring(0, lenght) + ConstApi.CUT_TEXT : value;
  }

  private getParam(args: number[]): number {
    return args === null || args.length === 0 || typeof args[0] !== 'number' ? 150 : args[0];
  }
}
