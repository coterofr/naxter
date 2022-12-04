import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { AlertService } from '../../../shared/services/alert.service';
import { User } from '../../model/user';
import { UserPageable } from '../../model/user-pageable';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users!: User[];

  constructor(private userService: UserService,
              private roleService: RoleService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private router: Router) { }

  ngOnInit(): void {
    this.enableTooltips();
    this.loadUsers();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe((users: UserPageable) => this.users = users.content);
  }

  get userLogged(): string | null {
    return this.jwtTokenService.getName();
  }

  get isAdmin(): boolean {
    return this.jwtTokenService.isAdmin();
  }

  getRoleName(role: string): string {
    return this.roleService.getRoleName(role);
  }

  block(name: string): void {
    this.userService.blockUser(name).subscribe(async (userBlock: User) => {
      this.users.forEach((user: User) => user.name === userBlock.name ? user.block = userBlock.block : user.block = user.block);

      const alert = userBlock.block ? 'admin.users.blocked' : 'admin.users.unblocked';
      await this.alertService.showAlert('alert-block', 'alert-block-text', true, this.translateService.instant(alert));
    });
  }

  edit(name: string): void {
    this.router.navigate(['/users', name]);
  }

  confirmDelete(name: string): void {
    Swal.fire({
      icon: 'question',
      title: this.translateService.instant('admin.users.confirmDelete.title'),
      text: this.translateService.instant('admin.users.confirmDelete.message', {user: name}),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('admin.users.delete'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'
    }).then(async (result) => {
      if(result.isConfirmed) {
        this.userService.deleteUser(name).subscribe(({ name: string }) => {
          this.users = this.users.filter((user: User) => user.name !== name);
        });

        await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('admin.users.deleted'));
      }
    });
  }

  async delete(name: string): Promise<void> {
    this.confirmDelete(name);
  }
}
