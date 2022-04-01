import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return true;
    // const isRoleAuthorized = route.data.roles.some((role) => {
    //   return this.authenticationSrv.getUserRole() === role;
    // });

    // if (!isRoleAuthorized) {
    //   const warningModal = this.modalService.open(ConfirmModalComponent, { windowClass: 'ngbmodal-centered' });
    //   warningModal.componentInstance.data = {
    //     text: `Tu cuenta no esta autorizada para ingresar esta página`,
    //   };
    //   warningModal.result.then(
    //     (result) => {
    //       this.router.navigate(['']);
    //     },
    //     (rejected) => {
    //       this.router.navigate(['']);
    //     }
    //   );
    // }

    // return isRoleAuthorized;
  }
}
