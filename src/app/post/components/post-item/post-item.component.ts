import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import Swal from 'sweetalert2';
import { PostService } from '../../services/post.service';
import { Post } from './../../model/post';

declare var bootstrap: any;

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {

  @Input() post: Post;
  @Output() deletePost: EventEmitter<string>;

  totalStars: number = 10;
  readonly: boolean = true;

  constructor(private postService: PostService,
              private jwtTokenService: JwtTokenService,
              private translateService: TranslateService) {
    this.post = new Post('', '', '', null, null, new Date(), false, '', null, 0);
    this.deletePost = new EventEmitter<string>();
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

  get isModerator(): boolean {
    return this.jwtTokenService.isModerator();
  }

  get canEdit(): boolean {
    return this.post.user?.name === this.loggedUser;
  }

  get canDelete(): boolean {
    return this.post.user?.name === this.loggedUser || this.isModerator;
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("post.errors.titleDeleted"),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  delete(): void {
    Swal.fire({
      
      icon: 'question',
      title: this.translateService.instant('post.confirmDelete.title'),
      text: this.translateService.instant('post.confirmDelete.message'),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('post.buttons.delete.title'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'

    }).then(async (result) => {
      if(result.isConfirmed) {
        this.postService.deletePost(this.post.id).subscribe((deleted: {id: string}) => {
          this.deletePost.emit(deleted.id);
        },
        error => {
          this.showModalError(this.translateService.instant('post.errors.message'));
        });
      }
    });
  }
}
