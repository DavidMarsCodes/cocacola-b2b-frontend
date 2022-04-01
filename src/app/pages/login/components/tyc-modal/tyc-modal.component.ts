import { Component, OnInit, Input, OnDestroy, Sanitizer } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Store } from '@ngrx/store';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tyc-modal',
  templateUrl: './tyc-modal.component.html',
  styleUrls: ['./tyc-modal.component.scss'],
})
export class TycModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() public data;
  userLocal: UserLocal;
  readonly ROOT_LANG = 'LOGIN.SIGN_UP.LEGALS.TYC_MODAL.';
  iframeSource: any;
  pdfUrl = environment.TYC_S3_HOST + 'assets/docs/tyc/';
  showIframe = true;
  reqPdfCounter = 0;
  iframeLoaded = false;
  iframeReloadInterval;

  constructor(
    private ngxSpinner: NgxSpinnerService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private store: Store<{ userLocal: UserLocal }>,
    private sanitizer: DomSanitizer
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
  }

  ngOnInit(): void {
    const completeUrl = `${this.pdfUrl}001_${this.userLocal.geoCountryCode}_${this.userLocal.organizationId}_term_condition.pdf#toolbar=0`;
    this.iframeSource = this.sanitizer.bypassSecurityTrustResourceUrl(completeUrl);
    this.ngxSpinner.show();
    this.iframeReloadInterval = setInterval(() => this.retryLoadIframe(), 2500);
  }

  retryLoadIframe(): void {
    if (this.iframeLoaded) {
      clearInterval(this.iframeReloadInterval);
      return;
    }
    this.reqPdfCounter = this.reqPdfCounter + 1;
    if (this.reqPdfCounter === 6) {
      this.toastr.error('Ocurrió un error al cargar los términos y condiciones. Intente nuevamente.');
      this.ngxSpinner.hide();
      clearInterval(this.iframeReloadInterval);
      return;
    }
    //retry
    this.showIframe = false;
    setTimeout(() => (this.showIframe = true), 100);
  }

  iframeLoad(): void {
    this.ngxSpinner.hide();
    this.iframeLoaded = true;
  }

  confirm(): void {
    this.activeModal.close(true);
  }

  reject(): void {
    this.activeModal.close(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
