import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, share, startWith, Subject, switchMap } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Theme } from '../../model/theme';
import { ThemeService } from '../../services/theme.service';

declare var bootstrap: any;

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {

  private name!: string;
  private searchTheme: Subject<string> = new Subject();
  
  themes$: Observable<Theme[]> = new Observable<Theme[]>();
  search: string = "";

  constructor(private themeService: ThemeService,
              private jwtTokenService: JwtTokenService) {
    this.loadUser();
    this.themes$ = this.searchTheme.pipe(startWith(this.search),
                                         debounceTime(500),
                                         distinctUntilChanged(),
                                         switchMap((query: any) => this.themeService.searchThemes(this.name, query)),
                                         share());
  }

  private loadUser(): void {
    this.name = this.jwtTokenService.getName() as string;
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  searchThemes() {
    this.searchTheme.next(this.search);
  }
}
