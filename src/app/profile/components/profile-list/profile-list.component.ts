import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Observable, share, startWith, Subject, switchMap } from 'rxjs';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from '../../../user/model/subscription';
import { User } from '../../../user/model/user';
import { RoleService } from '../../../user/services/role.service';
import { SubscriptionService } from '../../../user/services/subscription.service';
import { Join } from '../../model/join';
import { ProfileService } from '../../services/profile.service';

declare var bootstrap: any;

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {

  private name!: string;
  private subscriptions!: Subscription[];
  private searchProfile: Subject<string> = new Subject();
  
  users$: Observable<User[]> = new Observable<User[]>();
  search: string = "";

  totalStars: number = 10;
  readonly: boolean = true;

  constructor(private profileService: ProfileService,
              private roleService: RoleService,
              private subscriptionService: SubscriptionService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService) {

    this.users$ = this.searchProfile.pipe(startWith(this.search),
                                          debounceTime(500),
                                          distinctUntilChanged(),
                                          switchMap((query: any) => this.profileService.searchProfiles(query)),
                                          share());
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.loadUser();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private loadSubscriptions(): void {
    this.subscriptionService.getSubscriptionsBySubscriber(this.name).subscribe((subscriptions: Subscription[]) => this.subscriptions = subscriptions);
  }

  private loadUser(): void {
    this.name = this.jwtTokenService.getName() as string;

    this.loadSubscriptions();
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isLoggedConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
  }

  getRating(user: User): number {
    return user.rating;
  }

  searchProfiles() {
    this.searchProfile.next(this.search);
  }

  private isConsumer(user: User): boolean {
    return this.roleService.isProducer(user);
  }

  isProducer(user: User): boolean {
    return this.roleService.isProducer(user);
  }

  private isProducerNotLogged(producer: User): boolean {
    return producer.name !== this.name;
  }

  canChat(producer: User): boolean {
    return this.isProducerNotLogged(producer) && this.isLoggedConsumer && this.isConsumer(producer);
  }

  private hasSubscription(producer: string): boolean {
    return this.subscriptions && this.subscriptions.some((suscription: Subscription) => suscription.subscriber?.name === this.name && suscription.producer?.name === producer);
  }

  isSubscribed(producer: User): boolean {
    return this.isProducerNotLogged(producer) && this.isLoggedConsumer && this.hasSubscription(producer.name) && this.isProducer(producer);
  }

  isNotSubscribed(producer: User): boolean {
    return this.isProducerNotLogged(producer) && this.isLoggedConsumer && !this.hasSubscription(producer.name) && this.isProducer(producer);
  }

  subscribe(producer: string): void {
    const join: Join = new Join(this.name, producer);
    this.subscriptionService.subscribe(this.name, join).subscribe(async () => {
      this.loadSubscriptions();

      await this.alertService.showAlert('alert-subscribe', 'alert-subscribe-text', true, this.translateService.instant('profiles.subscribed'));
    });
  }

  unsubscribe(producer: string): void {
    const join: Join = new Join(this.name, producer);
    this.subscriptionService.unsubscribe(this.name, join).subscribe(async () => {
      this.loadSubscriptions();

      await this.alertService.showAlert('alert-subscribe', 'alert-subscribe-text', true, this.translateService.instant('profiles.unsubscribed'));
    });
  }
}
