import RandomId from '@jimkang/randomid';
import handleError from 'handle-error-web';
import { flickrConsumerKey, flickrConsumerSecret } from '../config';
import { hmacsha1} from './authutils';

const appURL = 'http://0.0.0.0:5000/';
var randomId = RandomId();
var accessToken;

const requestTokenBaseURL = 'https://smidgeo.com/flickr/services/oauth/request_token';

export default async function getFromFlickrFlow() {
  const requestTokenURL = requestTokenBaseURL+ '?' +
      `oauth_callback=${encodeURIComponent(appURL)}&` +
      `oauth_consumer_key=${flickrConsumerKey}&` +
      `oauth_nonce=${randomId(16)}&` +
      'oauth_signature_method=HMAC-SHA1&' +
      `oauth_timestamp=${new Date().getTime()}&` +
      'oauth_version=1.0';
  const baseString = `GET&${encodeURIComponent(requestTokenURL)}`;
  const key = flickrConsumerKey + '&' + flickrConsumerSecret;
  const oauthSig = hmacsha1(key, baseString);

  try {
    var res = await fetch(requestTokenURL +
      `&oauth_signature=${oauthSig}`,
    { mode: 'cors' }
    );
    if (!res.ok) {
      throw new Error(`Could not get request token: ${res.statusText}`);
    }
    console.log(res.status);
  } catch (error) {
    handleError(error);
  }

  // Emit images
}
