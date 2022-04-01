import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-terms',
  templateUrl: './privacy-terms.component.html',
  styleUrls: ['./privacy-terms.component.scss'],
})
export class PrivacyTermsComponent implements OnInit {
  privacyTerms = [1, 2, 3];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  returnHomeLogin(): void {
    this.router.navigate(['/']);
  }
}
