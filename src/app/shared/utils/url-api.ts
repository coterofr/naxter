import { environment } from "src/environments/environment";

export class UrlApi {

  public static BASIC: string = environment.baseUrl;

  public static SLASH: string = '/';
  public static CREATE: string = 'create';
  public static EDIT: string = 'edit';
  public static ADD: string = 'add';
  public static BLOCK: string = 'block';
  public static DELETE: string = 'delete';
  public static SEARCH: string = 'search';
  public static LIST: string = 'list';
  public static TOP: string = 'top';
  public static RATE: string = 'rate';
  public static SEND: string = 'send';

  public static AUTH: string = 'auth';
  public static REGISTER: string = 'register';
  public static LOGIN: string = 'login';
  public static REFRESH: string = 'refresh';

  public static USERS: string = 'users';
  public static AUTHORS: string = 'authors';
  public static ACCOUNT: string = 'account';
  public static PROFILES: string = 'profiles';
  public static PROFILE: string = 'profile';
  public static ROLE: string = 'role';
  public static VISIT: string = 'visit';
  public static CHANGE_GENERIC_ROLE: string = 'change-generic-role';

  public static SUBSCRIPTIONS: string = 'subscriptions';
  public static SUBSCRIBER: string = 'subscriber';
  public static PRODUCER: string = 'producer';
  public static SUBSCRIBE: string = 'subscribe';
  public static UNSUBSCRIBE: string = 'unsubscribe';

  public static THEMES: string = 'themes';
  public static POSTS: string = 'posts';
  public static HOME: string = 'home';
  public static TAGS: string = 'tags';
  public static COMMENTS: string = 'comments';

  public static CHAT: string = 'chat';
  public static MESSAGES: string = 'messages';
  
  public static MERCHANDASING: string = 'merchandising';
  public static ITEMS: string = 'items';

  public static generateUrl(...params: string[]): string {
    return params.reduce((prev: string, actual: string) => prev + actual);
  }
}
