import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';
import { Comment } from '../../model/comment';
import { PostComment } from '../../model/post-comment';
import { CommentService } from '../../services/comment.service';

declare var bootstrap: any;

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment: Comment;
  @Output() deleteComment: EventEmitter<string>;

  private postComment: PostComment;
  
  commentForm: FormGroup;
  editMode: boolean = false;

  constructor(private fb: FormBuilder,
              private commentService: CommentService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService) {
    this.comment = new Comment('', '', null, null, null);
    this.deleteComment = new EventEmitter<string>();
    this.postComment = new PostComment('', '', '', '');
    this.commentForm = this.fb.group({
      content: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initForm();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private initForm() {
    if(this.comment.user && this.comment.post) {
      this.postComment = new PostComment(this.comment.id, this.comment.content, this.comment.user.name, this.comment.post.id);
    }
    
    this.commentForm = this.fb.group({
      content: new FormControl(this.postComment.content, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500),
      ])
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isModerator(): boolean {
    return this.jwtTokenService.isModerator();
  }

  get canEdit(): boolean {
    return this.comment.user?.name === this.loggedUser;
  }

  get canDelete(): boolean {
    return this.comment.user?.name === this.loggedUser || this.isModerator;
  }

  get content(): FormControl {
    return this.commentForm.get('content') as FormControl;
  }

  get contentInvalid(): boolean | null {
    return this.content?.errors && (this.content?.touched || this.content?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.commentForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.commentForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  update() {
    if(this.commentForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.postComment.id = this.comment.id;
    this.postComment.content = this.content?.value;
    if(this.comment.user && this.comment.post) {
      this.postComment.user = this.comment.user?.name;
      this.postComment.post = this.comment.post?.name;
    }

    this.commentService.editComment(this.postComment.post, this.postComment.id, this.postComment)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (comment: Comment) => {
        this.comment = comment;
        this.editMode = false;

        await this.alertService.showAlert('alert-comment', 'alert-comment-text', true, this.translateService.instant('comment.updated'));
      },
      error => {
        this.showModalError(this.translateService.instant("comment.errors.titleUpdated"), this.translateService.instant('comment.errors.message'));
      }
    );
  }

  showModalError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  delete(): void {
    Swal.fire({
      
      icon: 'question',
      title: this.translateService.instant('comment.confirmDelete.title'),
      text: this.translateService.instant('comment.confirmDelete.message'),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('comment.buttons.delete'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'

    }).then(async (result) => {
      if(result.isConfirmed && this.comment.post) {
        this.commentService.deleteComment(this.comment.post.id, this.comment.id).subscribe((deleted: {id: string}) => {
          this.deleteComment.emit(deleted.id);
        },
        error => {
          this.showModalError(this.translateService.instant("comment.errors.titleDeleted"), this.translateService.instant('comment.errors.message'));
        });
      }
    });
  }
}
