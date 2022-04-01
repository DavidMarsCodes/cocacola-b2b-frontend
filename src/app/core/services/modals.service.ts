import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { Cart } from '../models/cart.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { deleteAllProducts } from '../state/actions/cart.actions';
import { updateHasDeliveryFrozenProducts } from '../state/actions/cart.actions';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { DocsViewModalComponent } from 'src/app/shared/modals/docs-view-modal/docs-view-modal.component';
import { EditDateModalComponent } from 'src/app/shared/modals/edit-date-modal/edit-date-modal.component';
@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  private subscriptions = new Subscription();
  cart: Cart;

  constructor(private modalService: NgbModal, private store: Store<{ cart: Cart }>, private gtmService: GoogleTagManagerService) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  openClientOrderBlockedModal(): void {
    const modalConfirm = this.modalService.open(ConfirmModalComponent, { windowClass: 'ngbmodal-centered' });
    modalConfirm.componentInstance.data = {
      id: 'accept-block-client-modal',
      customClass: 'blocked-client',
      image: 'tristecito.png',
      text: 'Tu cuenta se encuentra temporalmente bloqueada',
      description: 'Solo podrás ver tu información. \n Regulariza tu situación por favor',
      confirmBtnLabel: 'Aceptar',
    };
  }

  openCleanCartConfirm(): void {
    const modalConfirm = this.modalService.open(ConfirmModalComponent, { windowClass: 'ngbmodal-centered' });
    modalConfirm.componentInstance.data = {
      id: 'clean-cart',
      text: '¿Borramos el pedido?',
      description: 'Se eliminarán todos los productos de la lista',
      confirmBtnLabel: 'Sí, borrar',
      rejectBtnLabel: 'Cancelar',
    };
    modalConfirm.result.then(
      (confirm) => {
        if (confirm) {
          this.gtmService.pushTag({ event: 'removeProducts', products: this.cart.discountProducts });
          this.store.dispatch(deleteAllProducts());
          this.store.dispatch(updateHasDeliveryFrozenProducts());
        }
      },
      (rejected) => {}
    );
  }

  openEditFrozenDeliveryDate(
    type: string,
    showImage: boolean,
    dateDelivery: string | Date,
    noDatesError: boolean = false,
    text: string = 'FROZEN_PRODUCTS_LABEL_DELIVERY'
  ): void {
    const modalConfirm = this.modalService.open(EditDateModalComponent, { windowClass: 'ngbmodal-centered' });
    modalConfirm.componentInstance.data = {
      id: 'edit-date',
      text: text,
      image: showImage,
      description: 'CHANGE_DATE_DESCRIPTION',
      confirmBtnLabel: 'CONFIRM',
      dateDelivery: dateDelivery,
      noDatesError: noDatesError,
      type: type,
    };
  }

  openConditionsModal(): void {
    const modalConfirm = this.modalService.open(ConfirmModalComponent, { windowClass: 'ngbmodal-centered' });
    modalConfirm.componentInstance.data = {
      id: 'docs-view-modal',
      customClass: 'docs-view',
      text: 'Condiciones',
      description:
        'Para mantener activos los descuentos, solo necesitas mantener visible el precio de la promoción para tus clientes tanto en el afiche exterior de tu local, como en el coller, de acuerdo a las condiciones que te indicó el vendedor.',
      confirmBtnLabel: 'Aceptar',
    };
  }

  openDocsViewModal(title: String, fileName: String, nameDoc: String, nameBtn: String): void {
    const modalConfirm = this.modalService.open(DocsViewModalComponent, { windowClass: 'ngbmodal-centered', size: 'xl' });
    modalConfirm.componentInstance.data = {
      id: 'docs-view-modal',
      customClass: 'docs-view',
      fileName: fileName,
      titleModal: title,
      nameDoc: nameDoc,
      nameBtn: nameBtn,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
