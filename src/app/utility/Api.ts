const env = {
  dev: 'http://localhost:8080',
  prod: 'https://charmee-webservices-7sgqd.ondigitalocean.app',
};

export class Api {
  origin: string;
  url: string;

  constructor() {
    this.origin =
      location.href.match(/(localhost|127\.0\.0\.1)/i) == null
        ? env.prod
        : env.dev;
    this.url = this.origin + '/jollof';
  }
}

export const api = new Api();
