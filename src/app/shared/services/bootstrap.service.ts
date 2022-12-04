import { Injectable } from '@angular/core';

declare var bootstrap: any

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

  constructor() { }

  enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}
