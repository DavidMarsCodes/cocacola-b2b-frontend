import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { ParserUtils } from 'src/app/core/utils/parser-utils';
import { environment } from 'src/environments/environment';
import { BERespModel } from '../models/backend/BE-response.model';
import { Client } from '../models/client.model';
import { LoginUser } from '../models/login-user.model';
import { UserLocal } from '../models/user-local.model';
import { ApiService } from './api.service';
import { EncrDecrService } from './encr-decr.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly EndpointsCodes = EndpointsCodes;
  client: Client;
  userLocal: UserLocal;

  constructor(private apiSrv: ApiService, private encrDecrService: EncrDecrService, private store: Store<{ client: Client; userLocal: UserLocal }>) {
    this.store.select('client').subscribe((client) => (this.client = client));
    this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal));
  }

  getUserInfo(username: string): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv.get('users/' + username, EndpointsCodes.GET_USER_INFO, { showError: false }).subscribe(
        (res) => {
          if (!res?.data?.userId) obs.error({ code: 'UserLambdaValidationException' });
          res?.data?.clients?.forEach((client) => (client['hasLockOrder'] = client?.locks?.some((block) => block.lockOrder)));
          res?.data?.clients?.sort((client, clientB) => {
            if (client['hasLockOrder']) return 1;
            return -1;
          });
          obs.next(res);
        },
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  initClientSession(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv.get(`clients/${this.client.clientId}/initclientsession`, EndpointsCodes.INIT_CLIENT_SESSION, {}).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  changeUserPassword(username: string, code: string, password: string, showError: boolean): Observable<BERespModel> {
    const requestObj = {
      username: this.encrDecrService.encrypt(environment.AES_KEY, username),
      code: this.encrDecrService.encrypt(environment.AES_KEY, code),
      password: this.encrDecrService.encrypt(environment.AES_KEY, password),
    };
    return new Observable((obs) => {
      this.apiSrv.post('users/updatepassword', EndpointsCodes.UPDATE_USER_PWD, requestObj, { showError }).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

  setNewUser(loginUser: LoginUser): Observable<any> {
    const userReq = {
      firstName: this.encrDecrService.encrypt(environment.AES_KEY, loginUser.firstName),
      lastName: this.encrDecrService.encrypt(environment.AES_KEY, loginUser.lastName),
      email: this.encrDecrService.encrypt(environment.AES_KEY, loginUser.email),
      cellphone: this.encrDecrService.encrypt(environment.AES_KEY, loginUser.phone),
      password: this.encrDecrService.encrypt(environment.AES_KEY, loginUser.password),
      fieldSelectedToLogin: this.encrDecrService.encrypt(environment.AES_KEY, 'email'),
      client: {
        fiscalId: this.encrDecrService.encrypt(environment.AES_KEY, ParserUtils.set0ToFiscalId(loginUser.rutNumber, this.userLocal.geoCountryCode)),
        erpClientId: this.encrDecrService.encrypt(
          environment.AES_KEY,
          ParserUtils.set0ToErpClientId(loginUser.clientNumber + '', this.userLocal.geoCountryCode)
        ),
      },
    };

    return new Observable((obs) => {
      this.apiSrv.post('users', EndpointsCodes.POST_USER, userReq, { showError: false }).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }
}
