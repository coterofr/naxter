import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from '../../../user/model/subscription';
import { User } from '../../../user/model/user';
import { RoleService } from '../../../user/services/role.service';
import { SubscriptionService } from '../../../user/services/subscription.service';
import { Join } from '../../model/join';
import { Visualization } from '../../model/visualization';
import { ProfileService } from '../../services/profile.service';

declare var bootstrap: any;

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  private id!: string;
  private name!: string;
  private subscription: Subscription | null;
  
  user: User;

  totalStars: number = 10;
  readonly: boolean = true;

  constructor(private profileService: ProfileService,
              private roleService: RoleService,
              private subscriptionService: SubscriptionService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute) {
    this.user = new User('', '', '', '', false, 0, [], null, null, null);
    this.subscription = null;
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private async initData(): Promise<void> {
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);
    this.id = paramMap.get('id') as string;
    this.user = await firstValueFrom(this.profileService.getProfile(this.id));

    this.name = this.jwtTokenService.getName() as string;

    this.loadSubscription();
    this.visit();
  }

  private loadSubscription(): void {
    if(this.name !== this.user.name) {
      firstValueFrom(this.subscriptionService.getSubscription(this.name, this.user.name)).then((subscription: Subscription) => {
        this.subscription = subscription
      }).catch(error => { });
    }
  }

  private visit(): void {
    let visualization: Visualization = new Visualization(this.name, this.user.name);
    this.profileService.visit(this.id, visualization).subscribe();
  }

  get isLoggedConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
  }

  get isProducer(): boolean {
    return this.roleService.isProducer(this.user);
  }

  get isSubcribed(): boolean {
    return this.user.name !== this.name && this.isLoggedConsumer && !!this.subscription && this.isProducer;
  }

  get isNotSubcribed(): boolean {
    return this.user.name !== this.name && this.isLoggedConsumer && !this.subscription && this.isProducer;
  }

  subscribe(): void {
    const join: Join = new Join(this.name, this.user.name);
    this.subscriptionService.subscribe(this.name, join).subscribe(async () => {
      this.loadSubscription();

      await this.alertService.showAlert('alert-subscribe', 'alert-subscribe-text', true, this.translateService.instant('profiles.subscribed'));
    });
  }

  unsubscribe(): void {
    const join: Join = new Join(this.name, this.user.name);
    this.subscriptionService.unsubscribe(this.name, join).subscribe(async () => {
      this.loadSubscription();

      await this.alertService.showAlert('alert-subscribe', 'alert-subscribe-text', true, this.translateService.instant('profiles.unsubscribed'));
    });
  }
}
