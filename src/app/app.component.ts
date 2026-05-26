import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Biar header tidak naik ke status bar HP
    await StatusBar.setOverlaysWebView({ overlay: false });

    // Icon status bar tetap terlihat
    await StatusBar.setStyle({ style: Style.Light });
  }

}