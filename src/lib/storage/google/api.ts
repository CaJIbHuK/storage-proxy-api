import config from "config";
import * as google from "googleapis";
import {promisifyErrRes} from "lib/promisify";
import {StorageAPI, StorageApiToken} from "lib/storage/base";
import {GoogleFile, GoogleFileAPI} from "./file";


const openurl = require('openurl');
const OAuth2 = google.auth.OAuth2;

const googleConfig = config.app.google;
//TODO refacotor
const REDIRECT = "http://localhost:3000/api/v1/auth/google";

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

export class GoogleAPI implements StorageAPI {

  private client : any;
  private service : any;
  private scopes : string[] = [
    'https://www.googleapis.com/auth/drive'
  ];

  public files : GoogleFileAPI;

  constructor(credentials? : GoogleApiToken) {
    this.client = new OAuth2(
      googleConfig.id,
      googleConfig.secret,
      REDIRECT
    );
    if (credentials) this.auth(credentials);
    this.service = google.drive({version : 'v3', auth : this.client});
    this.files = new GoogleFileAPI(this.service);
  }

  auth(credentials : GoogleApiToken) : void {
    this.client.setCredentials(credentials);
  }

  async refreshTokens() : Promise<GoogleRefreshedApiToken> {
    return promisifyErrRes<GoogleRefreshedApiToken>(this.client.refreshAccessToken.bind(this.client));
  }

  requestAccess(userId : number) : void {
    let authUrl = this.client.generateAuthUrl({
      access_type : "offline",
      scope : this.scopes,
      state : userId
    });

    openurl.open(authUrl);
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

