import config from "config";
import * as google from "googleapis";
const openurl = require('openurl');
const OAuth2 = google.auth.OAuth2;

const googleConfig = config.app.google;

export const TOKEN_TYPES = {
  bearer : "Bearer"
};

export interface GoogleApiToken {
  access_token : string;
  refresh_token : string;
  token_type : string;
  expiry_date : number;
}

class GoogleAPI {

  oauth2Client : any;
  scopes : string[] = [
    'https://www.googleapis.com/auth/drive'
  ];

  constructor() {
    this.oauth2Client = new OAuth2(
      googleConfig.id,
      googleConfig.secret,
      "http://localhost:3000/api/v1/auth/google"
    );
  }

  requestAccess(userId : number) : void {
    let authUrl = this.oauth2Client.generateAuthUrl({
      access_type : "offline",
      scope : this.scopes,
      state : userId
    });

    openurl.open(authUrl);
  }

  async getToken(authCode : string) : Promise<GoogleApiToken> {
    return new Promise<GoogleApiToken>((res, rej) => {
      this.oauth2Client
        .getToken(authCode, (err, tokens : GoogleApiToken) => {
          if (err) return rej(err);
          return res(tokens);
        })
    });
  }

}


export default class GoogleAPIFabric {

  static api : GoogleAPI = null;

  static getAPI() {
    if (!this.api) this.api = new GoogleAPI();
    return this.api;
  }

}

