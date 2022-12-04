import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';
import { Comment } from '../../model/comment';
import { Post } from '../../model/post';
import { PostComment } from '../../model/post-comment';
import { CommentService } from '../../services/comment.service';

declare var bootstrap: any;

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() post: Post;

  private postComment: PostComment;
  
  comments: Comment[];
  commentForm: FormGroup;

  constructor(private fb: FormBuilder,
              private commentService: CommentService,
              private jwtTokenService: JwtTokenService,
              private translateService: TranslateService,
              private alertService: AlertService) {
    this.post = new Post('', '', '', null, null, new Date(), false, '', null, 0);            
    this.comments = [];
    this.postComment = new PostComment('', '', '', '');
    this.commentForm = this.fb.group({
      content: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
    this.initForm();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  initData(): void {
    this.commentService.getComments(this.post.id).subscribe((comments: Comment[]) => this.comments = comments);
  }

  private initForm() {
    this.postComment = new PostComment('', '', this.loggedUser, this.post.id);
    
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

  get isConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
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

  showModalError(): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("comment.errors.titleAdded"),
      text: this.translateService.instant('comment.errors.message'),
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  add() {
    if(this.commentForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.postComment.id = '';
    this.postComment.content = this.content?.value;
    this.postComment.user = this.loggedUser;
    this.postComment.post = this.post.id;

    this.commentService.addComment(this.postComment.post, this.postComment)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async () => {
        this.initData();
        this.content.setValue('');

        await this.alertService.showAlert('alert-comment', 'alert-comment-text', true, this.translateService.instant('comment.added'));
      },
      error => {
        this.showModalError();
      }
    );
  }

  async deleteComment(id: string) {
    this.comments = this.comments.filter((comment: Comment) => comment.id !== id);

    await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('comment.deleted'));
  }
}
