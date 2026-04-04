import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';

/** URL base del informe embebido (Power BI). El parámetro _rv fuerza recarga al pulsar "Recargar". */
const POWER_BI_EMBED_BASE =
  'https://app.powerbi.com/reportEmbed?reportId=d510f275-7e14-4c09-82fb-03df8a4eb093&autoAuth=true&ctid=899789dc-202f-44b4-8472-a6d40f9eb440';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, RouterLink]
})
export class DashboardComponent {
  readonly powerBiEmbedUrl = POWER_BI_EMBED_BASE;

  safeEmbedUrl: SafeResourceUrl;
  iframeLoaded = false;
  iframeError = false;
  private embedRevision = 0;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.safeEmbedUrl = this.buildSafeUrl();
  }

  private buildSafeUrl(): SafeResourceUrl {
    const sep = POWER_BI_EMBED_BASE.includes('?') ? '&' : '?';
    const url = `${POWER_BI_EMBED_BASE}${sep}_rv=${this.embedRevision}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onIframeLoad(): void {
    // Diferir: en algunos entornos el load del iframe ocurre en el mismo ciclo de CD.
    setTimeout(() => {
      this.iframeLoaded = true;
      this.iframeError = false;
    });
  }

  onIframeError(): void {
    setTimeout(() => {
      this.iframeError = true;
      this.iframeLoaded = true;
    });
  }

  reloadEmbed(): void {
    this.embedRevision += 1;
    this.iframeLoaded = false;
    this.iframeError = false;
    this.safeEmbedUrl = this.buildSafeUrl();
  }
}
