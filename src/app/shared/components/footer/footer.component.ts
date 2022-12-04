import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private jwtTokenService: JwtTokenService,
              private router: Router) { }

  ngOnInit(): void { }

  get isLogged(): boolean {
    return this.jwtTokenService.isLogged();
  }

  logout(): void {
    this.jwtTokenService.removeJwtToken();
    this.router.navigateByUrl('auth/login');
  }
}
