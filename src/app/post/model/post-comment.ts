export class PostComment {

  id: string;
  content: string;
  user: string;
  post: string;

  constructor(id: string,
              content: string,
              user: string,
              post: string) {
    this.id = id;
    this.content = content;
    this.user = user;
    this.post = post;
  }
}
