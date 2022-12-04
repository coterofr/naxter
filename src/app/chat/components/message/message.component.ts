import { Component, Input, OnInit } from '@angular/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Message } from '../../model/message';

declare var bootstrap: any;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;


  constructor(private jwtTokenService: JwtTokenService) {
    this.message = new Message('', null, null, '', null);
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isEmitter(): boolean {
    return this.message.emitter?.name === this.loggedUser;
  }
}