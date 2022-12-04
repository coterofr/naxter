import { Injectable } from '@angular/core';
import { ConstApi } from '../utils/const-api';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private element:  HTMLElement | null;
  private textElement:  HTMLElement | null;

  constructor() {
    this.element = null;
    this.textElement = null;
  }

  async wait(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  async showAlert(alert: string,
                  textAlert: string,
                  success: boolean,
                  message: string): Promise<void> {
    this.element = document.getElementById(alert);
    this.textElement = document.getElementById(textAlert);
    if(this.element && this.textElement && success) {
      this.textElement.textContent = ConstApi.ALERT_ICON_SPACE + message;
      this.element.classList.remove('d-none');
      await this.wait(3000);
      this.element.classList.add('d-none');
    }
  }
}
