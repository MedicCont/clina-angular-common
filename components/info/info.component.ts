import { CommonModule, JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { environment } from '@environments/environment';

// --- Interfaces para tipagem dos dados ---
interface StorageData {
  [key: string]: any;
}
interface ServerInfo {
  serverTime: string;
  serverVersion: string;
  serverOS: string;
}
interface PerformanceInfo {
  loadTime: string;
  dnsLookup: string;
  tcpHandshake: string;
  ttfb: string;
  usedHeapSize: string;
  totalHeapSize: string;
}
interface NetworkInfo {
  type?: string;
  effectiveType?: string;
  downlink?: string;
  rtt?: string;
}
// Interface atualizada para incluir JavaScript
interface FeatureSupport {
  javaScriptEnabled: boolean;
  serviceWorker: boolean;
  geolocation: boolean;
  notifications: boolean;
  webGL: boolean;
}
// Nova interface para o status das permissões
interface PermissionsInfo {
    [key: string]: PermissionState | 'not-supported';
}

@Component({
  selector: 'app-info-diagnostics',
  standalone: true,
  imports: [CommonModule, JsonPipe, NgClass], // Adicionado NgClass para as cores
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <style>
    :host, * {
      font-family: 'ui-monospace', SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .btn{
      width: auto;
    }
    .bg-secondary {
      background-color: #1f2937!important;
      color: #ffffff;
    }
    /* Classes para colorir o status das permissões */
    .text-success { color: #28a745 !important; font-weight: bold; }
    .text-warning { color: #ffc107 !important; font-weight: bold; }
    .text-danger { color: #dc3545 !important; font-weight: bold; }
    .text-muted { color: #6c757d !important; }
  </style>
    <div class="container-fluid min-h-screen p-4 text-light" style="background: #101827;">
      <div class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
        <h1 class="h3 font-weight-bold">System Diagnostics</h1>
        <button (click)="reset()" class="btn btn-danger btn-sm">Reset</button>
      </div>

      <div class="row g-4">
        @for (section of infoSections; track section.title) {
        <div class="col-12 col-lg-6">
          <div class="card h-100 bg-secondary text-light">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h2 class="h6 mb-0">{{ section.title }}</h2>
              <button class="btn btn-outline-light btn-sm" (click)="copyToClipboard(section.data())">Copy</button>
            </div>
            <div class="card-body" style="font-size: 0.85rem; word-break: break-all;">
              @if(section.data(); as data) {
                <dl class="row mb-0">
                  @for(key of objectKeys(data); track key) {
                  <dt class="col-sm-4 text-white-50">{{ formatKey(key) }}:</dt>
                  <dd class="col-sm-8">
                    @if(isObject(data[key])) {
                      <pre class="mb-0 small bg-dark p-1 rounded"><code>{{ data[key] | json }}</code></pre>
                    } @else {
                      <!-- Lógica para colorir o status da permissão -->
                      <span [ngClass]="{
                        'text-success': data[key] === 'granted',
                        'text-warning': data[key] === 'prompt',
                        'text-danger': data[key] === 'denied',
                        'text-muted': data[key] === 'not-supported'
                      }">{{ data[key] }}</span>
                    }
                  </dd>
                  }
                </dl>
              } @else {
                <p class="text-muted text-center py-2">Loading or Not Supported...</p>
              }
            </div>
          </div>
        </div>
        }
      </div>

      <div class="row g-4 mt-1">
        @for (section of storageSections; track section.title) {
        <div class="col-12">
          <div class="card bg-secondary text-light">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h2 class="h6 mb-0">{{ section.title }}</h2>
              <button class="btn btn-outline-light btn-sm" (click)="copyToClipboard(section.data())">Copy</button>
            </div>
            <div class="card-body p-0">
              @if (objectKeys(section.data()).length > 0) {
              <div class="table-responsive" style="max-height: 250px;">
                <table class="table table-sm table-striped table-dark table-hover mb-0">
                  <thead>
                    <tr>
                      <th class="px-3" style="width: 30%;">Key</th>
                      <th class="px-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (key of objectKeys(section.data()); track key) {
                    <tr style="vertical-align: middle;">
                      <td class="px-3 font-monospace text-info" style="word-break: break-all;">{{ key }}</td>
                      <td class="px-3" style="word-break: break-all; max-width: 300px;">{{ section.data()[key] }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
              } @else {
              <p class="text-muted text-center p-4 mb-0">No data in {{ section.title }}.</p>
              }
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class InfoComponent implements OnInit {
  // --- Signals ---
  browserInfo = signal({});
  clientInfo = signal({});
  connectionInfo = signal({});
  performanceInfo = signal<PerformanceInfo | null>(null);
  networkInfo = signal<NetworkInfo>({});
  featureSupport = signal<FeatureSupport | null>(null);
  permissionsInfo = signal<PermissionsInfo>({}); // NOVO SIGNAL
  localStorageData = signal<StorageData>({});
  sessionStorageData = signal<StorageData>({});
  cookieData = signal<StorageData>({});
  serverInfo = signal<ServerInfo | null>(null);
  environmentInfo = signal(environment);

  // --- Estrutura de dados para renderização dinâmica ---
  infoSections: { title: string; data: WritableSignal<any> }[] = [
    { title: 'Browser Permissions', data: this.permissionsInfo }, // NOVA SEÇÃO
    { title: 'Feature Support', data: this.featureSupport },
    { title: 'Browser Info', data: this.browserInfo },
    { title: 'Client Info', data: this.clientInfo },
    { title: 'Connection Info', data: this.connectionInfo },
    { title: 'Page Performance', data: this.performanceInfo },
    { title: 'Network Status', data: this.networkInfo },
    { title: 'Server Info (Mocked)', data: this.serverInfo },
    { title: 'Environment', data: this.environmentInfo },
  ];

  storageSections: { title: string; data: WritableSignal<StorageData> }[] = [
    { title: 'Local Storage', data: this.localStorageData },
    { title: 'Session Storage', data: this.sessionStorageData },
    { title: 'Cookies', data: this.cookieData },
  ];

  // --- Helpers ---
  objectKeys = Object.keys;
  isObject = (value: any): boolean => typeof value === 'object' && value !== null;
  formatKey = (key: string): string => {
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  constructor() {
    this.populateInitialData();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.clientInfo.update((info: any) => ({
        ...info,
        localTime: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
      }));
    }, 1000);
    this.loadMockServerData();
  }

  private populateInitialData(): void {
    this.browserInfo.set({
      userAgent: navigator.userAgent, language: navigator.language, platform: navigator.platform,
      isOnline: navigator.onLine, cookiesEnabled: navigator.cookieEnabled,
    });
    this.clientInfo.set({
      localTime: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowResolution: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: window.screen.colorDepth, devicePixelRatio: window.devicePixelRatio,
    });
    this.connectionInfo.set({
      host: window.location.host, protocol: window.location.protocol, origin: window.location.origin,
    });
    setTimeout(() => this.collectPerformanceMetrics(), 100);
    this.collectNetworkInfo();
    this.collectFeatureSupport();
    this.localStorageData.set(this.getStorageData(localStorage));
    this.sessionStorageData.set(this.getStorageData(sessionStorage));
    this.cookieData.set(this.getCookies());
    // Nova chamada para coletar permissões
    this.collectPermissions();
  }

  // --- NOVO MÉTODO PARA COLETAR PERMISSÕES ---
  private async collectPermissions(): Promise<void> {
    if (!navigator.permissions) {
      console.warn('Permissions API is not supported in this browser.');
      this.permissionsInfo.set({ 'permissionsApi': 'not-supported' });
      return;
    }

    const permissionNames: any[] = [
      "camera" , "geolocation" , "microphone" , "midi" , "notifications" , "persistent-storage" , "push" , "screen-wake-lock" , "storage-access"
    ];
    
    const permissionStates: PermissionsInfo = {};

    const queries = permissionNames.map(name => 
      navigator.permissions.query({ name }).then(status => ({ name, state: status.state }))
      .catch(() => ({ name, state: 'not-supported' as const }))
    );
    
    const results = await Promise.all(queries);
    results.forEach(result => {
        permissionStates[result.name] = result.state;
    });
    this.permissionsInfo.set(permissionStates);
  }

  private collectPerformanceMetrics(): void {
    try {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      this.performanceInfo.set({
        loadTime: `${(timing.duration / 1000).toFixed(2)}s`,
        dnsLookup: `${(timing.domainLookupEnd - timing.domainLookupStart).toFixed(2)}ms`,
        tcpHandshake: `${(timing.connectEnd - timing.connectStart).toFixed(2)}ms`,
        ttfb: `${(timing.responseStart - timing.requestStart).toFixed(2)}ms`,
        usedHeapSize: `${((memory?.usedJSHeapSize || 0) / 1048576).toFixed(2)} MB`,
        totalHeapSize: `${((memory?.totalJSHeapSize || 0) / 1048576).toFixed(2)} MB`,
      });
    } catch (e) {
      console.warn('API de Performance Navigation Timing não suportada.', e);
      this.performanceInfo.set(null);
    }
  }

  private collectNetworkInfo(): void {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      this.networkInfo.set({
        type: connection.type, effectiveType: connection.effectiveType,
        downlink: `${connection.downlink} Mbps`, rtt: `${connection.rtt} ms`,
      });
    } else {
      this.networkInfo.set({ type: 'API não suportada' });
    }
  }

  // --- MÉTODO ATUALIZADO ---
  private collectFeatureSupport(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.featureSupport.set({
      javaScriptEnabled: true, // Se o código roda, JS está obviamente habilitado
      serviceWorker: 'serviceWorker' in navigator,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      webGL: gl instanceof WebGLRenderingContext,
    });
  }

  private getStorageData(storage: Storage): StorageData {
    const data: StorageData = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) { data[key] = storage.getItem(key) || ''; }
    }
    return data;
  }

  private getCookies(): StorageData {
    const cookies: StorageData = {};
    if (document.cookie === '') return cookies;
    const cookiePairs = document.cookie.split(';');
    for (const pair of cookiePairs) {
      const parts = pair.split('=');
      const key = decodeURIComponent(parts[0].trim());
      const value = decodeURIComponent(parts.slice(1).join('='));
      cookies[key] = value;
    }
    return cookies;
  }

  private loadMockServerData(): void {
    setTimeout(() => {
      this.serverInfo.set({
        serverTime: new Date(Date.now() + 1000).toLocaleTimeString('pt-BR'),
        serverVersion: 'nginx/1.25.3', serverOS: 'Linux (Alpine)',
      });
    }, 500);
  }

  copyToClipboard(data: object | null): void {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(
      () => console.log('Dados de diagnóstico copiados para a área de transferência!'),
      (err) => console.error('Falha ao copiar dados: ', err)
    );
  }

  public reset(): void {
    if (!confirm('Tem certeza que deseja limpar todo o armazenamento e forçar o recarregamento da página?')) {
      return;
    }
    console.warn('Iniciando Hard Reset...');
    try { localStorage.clear(); console.log('Local Storage limpo.'); } catch (e) { console.error('Erro ao limpar Local Storage:', e); }
    try { sessionStorage.clear(); console.log('Session Storage limpo.'); } catch (e) { console.error('Erro ao limpar Session Storage:', e); }
    this.clearClientCookies();
    location.reload();
  }

  private clearClientCookies(): void {
    console.log('Tentando limpar cookies (Cookies HttpOnly não podem ser apagados via script).');
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    console.log('Limpeza de cookies finalizada.');
  }
}