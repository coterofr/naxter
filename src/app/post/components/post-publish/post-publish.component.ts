import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Theme } from 'src/app/theme/model/theme';
import { ThemeService } from 'src/app/theme/services/theme.service';
import Swal from 'sweetalert2';
import { Tag } from '../../model/tag';
import { TagPageable } from '../../model/tag-pageable';
import { UserPost } from '../../model/user-post';
import { PostService } from '../../services/post.service';
import { Post } from './../../model/post';
import { TagService } from './../../services/tag.service';

declare var bootstrap: any;

@Component({
  selector: 'app-post-publish',
  templateUrl: './post-publish.component.html',
  styleUrls: ['./post-publish.component.scss']
})
export class PostPublishComponent implements OnInit {

  private post: Post;
  private userPost: UserPost;

  id!: string;
  themes!: Theme[];
  
  postForm: FormGroup;

  tags: Tag[] = [];
  tagName: string = '';
  tagDescription: string = '';

  constructor(private fb: FormBuilder,
              private tagService: TagService,
              private postService: PostService,
              private themeService: ThemeService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
    this.post = new Post('', '', '', null, null, new Date(), false, '', null, 0);
    this.userPost = new UserPost('', '', '', '', '', null);
    this.postForm = this.fb.group({
      name: new FormControl(''),
      theme: new FormControl(''),
      description: new FormControl(''),
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
  
  private async initForm() {
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);

    if(paramMap.get('id')) {
      this.id = paramMap.get('id') as string;
      this.post = await firstValueFrom(this.postService.getPost(this.id));
      this.userPost = new UserPost(this.post.id, this.post.name, this.post.description, this.loggedUser, this.post.theme?.name as string, 
                                   this.post.tags ? this.post.tags?.map(tag => tag.name) : []);
      this.tagService.getTags(this.id).subscribe((tagPageable: TagPageable) => this.tags = tagPageable.content);
    } else {
      this.userPost = new UserPost('', '', '', this.loggedUser, '', []);
    }

    this.themeService.getThemes().subscribe((themes: Theme[]) => this.themes = themes);

    this.postForm = this.fb.group({
      name: new FormControl(this.userPost.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      theme: new FormControl(this.userPost.theme, [
        Validators.required
      ]),
      description: new FormControl(this.userPost.description, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500),
      ])
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get name(): FormControl {
    return this.postForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get description(): FormControl {
    return this.postForm.get('description') as FormControl;
  }

  get descriptionInvalid(): boolean | null {
    return this.description?.errors && (this.description?.touched || this.description?.dirty);
  }

  get theme(): FormControl {
    return this.postForm.get('theme') as FormControl;
  }

  get themeInvalid(): boolean | null {
    return this.theme?.errors && (this.theme?.touched || this.theme?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.postForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.postForm.controls).forEach(control => control.setErrors({'invalid': true}));
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

  async publish(): Promise<void> {
    if(this.postForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.userPost.id = this.id;
    this.userPost.name = this.name?.value;
    this.userPost.description = this.description?.value;
    this.userPost.user = this.loggedUser;
    this.userPost.theme = this.theme?.value;

    if(this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  private create(): void {
    this.postService.createPost(this.userPost)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (post: Post) => {
        this.post =  post;
        this.id = post.id;
        this.tagService.getTags(post.id).subscribe((tagPageable: TagPageable) => this.tags = tagPageable.content);

        await this.alertService.showAlert('alert-post', 'alert-post-text', true, this.translateService.instant('post.created'));
      },
      error => {
        this.showModalError(this.translateService.instant("post.errors.titleCreated"), this.translateService.instant('post.errors.message'));
      }
    );
  }

  private edit(): void {
    this.postService.editPost(this.userPost.id, this.userPost)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (post: Post) => {
        this.post = post;

        await this.alertService.showAlert('alert-post', 'alert-post-text', true, this.translateService.instant('post.updated'));
      },
      error => {
        this.showModalError(this.translateService.instant("post.errors.titleUpdated"), this.translateService.instant('post.errors.message'));
      }
    );
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
        this.postService.deletePost(this.post.id).subscribe(async (deleted: {id: string}) => {
          await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('post.deleted'));

          this.router.navigateByUrl('posts/list');
        },
        error => {
          this.showModalError(this.translateService.instant("post.errors.titleDeleted"), this.translateService.instant('post.errors.message'));
        });
      }
    });
  }

  addTag() {
    if(this.id && this.tagName) {
      let tag: Tag = new Tag(this.tagName, this.tagDescription);

      this.tagService.addTag(this.id, tag).subscribe(async (tag: Tag) => {
        this.tags.push(tag);
        this.tagName = '';
        this.tagDescription = '';

        await this.alertService.showAlert('alert-tag', 'alert-tag-text', true, this.translateService.instant('post.tags.added'));
      },
      error => {
        this.showModalError(this.translateService.instant("post.tags.errors.titleAdded"), this.translateService.instant('post.tags.errors.message'));
      });
    }
  }

  deleteTag(idTag: string | null) {
    if(this.id && idTag) {

      this.tagService.deleteTag(this.id, idTag).subscribe(async (deleted: {id: string}) => {
        this.tags = this.tags.filter((tag: Tag) => tag.id !== deleted.id);

        await this.alertService.showAlert('alert-tag', 'alert-tag-text', true, this.translateService.instant('post.tags.deleted'));
      },
      error => {
        this.showModalError(this.translateService.instant("post.tags.errors.titleDeleted"), this.translateService.instant('post.tags.errors.message'));
      });
    }
  }
}
