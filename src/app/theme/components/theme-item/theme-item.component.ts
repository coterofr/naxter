import { Component, Input, OnInit } from '@angular/core';
import { Theme } from '../../model/theme';

declare var bootstrap: any;

@Component({
  selector: 'app-theme-item',
  templateUrl: './theme-item.component.html',
  styleUrls: ['./theme-item.component.scss']
})
export class ThemeItemComponent implements OnInit {

  @Input() theme: Theme;

  constructor() {
    this.theme = new Theme('', '', null);
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}
