import config from "config";
import * as google from "googleapis";
import {promisifyErrRes} from "lib/promisify";
import {StorageAPI, StorageApiToken} from "lib/storage/base";
import {GoogleDriveFileAPI} from "./file";


const openurl = require('openurl');
const OAuth2 = google.auth.OAuth2;

const googleConfig = config.app.google;

export interface GoogleApiToken extends StorageApiToken {
  access_token : string;
  refresh_token : string;
  token_type : string;
  expiry_date : number;
}

export interface GoogleRefreshedApiToken extends StorageApiToken {
  access_token : string;
  expires_in : number;
}

export class GoogleDriveAPI implements StorageAPI {

  private client : any;
  private service : any;
  private scopes : string[] = [
    'https://www.googleapis.com/auth/drive'
  ];

  public files : GoogleDriveFileAPI;

  constructor(credentials? : GoogleApiToken) {
    this.client = new OAuth2(
      googleConfig.id,
      googleConfig.secret,
      googleConfig.redirect
    );
    if (credentials) this.auth(credentials);
    this.service = google.drive({version : 'v3', auth : this.client});
    this.files = new GoogleDriveFileAPI(this.service);
  }

  auth(credentials : GoogleApiToken) : void {
    this.client.setCredentials(credentials);
  }

  async refreshTokens() : Promise<GoogleRefreshedApiToken> {
    return promisifyErrRes<GoogleRefreshedApiToken>(this.client.refreshAccessToken.bind(this.client));
  }

  requestAccess(userId : number) : string {
    let authUrl = this.client.generateAuthUrl({
      access_type : "offline",
      scope : this.scopes,
      state : userId
    });

    return authUrl;
  }

  getToken(authCode : string) : Promise<GoogleApiToken> {
    return new Promise<GoogleApiToken>((res, rej) => {
      this.client.getToken(authCode, (err, tokens : GoogleApiToken) => {
          if (err) return rej(err);
          return res(tokens);
        })
    });
  }

}

