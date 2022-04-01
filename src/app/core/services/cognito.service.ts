import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import Amplify, { Auth } from 'aws-amplify';
import { NgxSpinnerService } from 'ngx-spinner';
import { from, Observable } from 'rxjs';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import { environment } from 'src/environments/environment';
import { EndpointsCodes } from '../enums/endpoints-codes.enum';
import { CognitoErrorResp } from '../models/backend/cognito-error-resp';
import { UserInfo } from '../models/user-info.model';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  readonly EndpointsCodes = EndpointsCodes;

  constructor(
    private spinner: NgxSpinnerService,
    private gtmService: GoogleTagManagerService,
    private translateService: TranslateService,
    private store: Store<{ user: UserInfo }>
  ) {
    Amplify.configure({
      Auth: {
        identityPoolId: environment.AWS_IDENTITY_POOL_ID,
        region: environment.AWS_REGION,
        userPoolId: environment.AWS_USER_POOL_ID,
        userPoolWebClientId: environment.AWS_CLIENT_ID,
      },
    });
  }

  signInAws(user, pwd): Observable<any> {
    this.spinner.show();
    return new Observable<any>((obs) => {
      from(Auth.signIn(user, pwd)).subscribe(
        (cognitoUser) => {
          this.spinner.hide();
          obs.next(cognitoUser);
        },
        (error) => {
          this.spinner.hide();
          this.pushGTMError(EndpointsCodes.AWS_LOGIN, error);
          obs.error(error);
        }
      );
    });
  }

  getSessionExpirationTime(): Observable<any> {
    return new Observable<any>((obs) => {
      from(Auth.currentSession()).subscribe(
        (currentSession) => {
          obs.next(currentSession.getAccessToken().getExpiration());
        },
        (error) => obs.error(error)
      );
    });
  }

  refreshUserSession(): Observable<any> {
    return new Observable<any>((obs) => {
      from(Auth.currentAuthenticatedUser()).subscribe(
        (cognitoUser) => {
          from(Auth.currentSession()).subscribe(
            (currentSession) => {
              cognitoUser.refreshSession(currentSession.getRefreshToken(), (err, refreshSession) => {
                this.store.dispatch(UserActions.loadJwt({ jwt: refreshSession.idToken.jwtToken }));
                obs.next();
              });
            },
            (error) => obs.error(error)
          );
        },
        (error) => obs.error(error)
      );
    });
  }

  confirmSignUpAws(username: string, code: string): Observable<any> {
    this.spinner.show();
    return new Observable((obs) => {
      from(Auth.confirmSignUp(username, code?.toString())).subscribe(
        (res) => {
          this.spinner.hide();
          obs.next(res);
        },
        (error) => {
          this.spinner.hide();
          this.pushGTMError(EndpointsCodes.AWS_CONFIRM_SIGN_UP, error);
          obs.error(error);
        }
      );
    });
  }

  forgotPassword(username: string): Observable<any> {
    this.spinner.show();
    return new Observable<any>((obs) => {
      from(Auth.forgotPassword(username)).subscribe(
        (res) => {
          this.spinner.hide();
          obs.next(res);
        },
        (error) => {
          this.spinner.hide();
          this.pushGTMError(EndpointsCodes.AWS_SEND_CONFIRM_CODE, error);
          obs.error(error);
        }
      );
    });
  }

  resendSignUp(username: string): Observable<any> {
    this.spinner.show();
    return new Observable<any>((obs) => {
      from(Auth.resendSignUp(username)).subscribe(
        (res) => {
          this.spinner.hide();
          obs.next(res);
        },
        (error) => {
          this.spinner.hide();
          this.pushGTMError(EndpointsCodes.AWS_RESEND_SIGN_UP, error);
          obs.error(error);
        }
      );
    });
  }

  pushGTMError(serviceKey, cognitoError: CognitoErrorResp): void {
    let description;
    this.translateService.get('ERRORS.' + cognitoError.code).subscribe((errorText: string) => {
      description = errorText.startsWith('ERRORS.') ? cognitoError.name + ' - ' + cognitoError.message : errorText;
    });

    this.gtmService.pushTag({
      event: 'error',
      error: {
        serviceKey,
        source: 'cognito',
        description,
      },
    });
  }
}
