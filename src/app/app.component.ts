import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthorityService } from './core/auth/authority.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'beta-blog';
  isLargeScreen!: boolean;
  isLoggedIn!: boolean;

  lastScrollPosition = 0;

  isScrollUp = true;

  private breakpointObserver: BreakpointObserver;

  constructor(private bpo: BreakpointObserver, private auth: AuthorityService) {
    this.breakpointObserver = this.bpo;

    this.auth.isLoggedin$.subscribe((res) => {
      this.isLoggedIn = res;
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe('(min-width: 768px)').subscribe((state) => {
      this.isLargeScreen = state.matches;
    });
  }

  @HostListener('window:scroll', ['$event'])
  toggleBottomBar() {
    if (scrollY < this.lastScrollPosition) {
      this.isScrollUp = true;
    } else {
      this.isScrollUp = false;
    }
    this.lastScrollPosition = scrollY;
  }
}
