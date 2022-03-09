import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListnerSubs: Subscription;
  public userIsAuthenticated = false;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
}
