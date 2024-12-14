import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { IManagedObject } from '@c8y/client';
import {
  ContextData,
  ContextRouteService
} from '@c8y/ngx-components';
import { filter, ReplaySubject } from 'rxjs';
import { _LocalStorageKeys } from '../const/localstorage.const';
import { _LocalstorageDevice } from '../model/last-device.model';

@Injectable({
  providedIn: 'root',
})
export class LastDeviceService {
  private activatedContextData!: ContextData;
  private upperLimitVisitedDevices = 30;
  private $deviceHistory: ReplaySubject<_LocalstorageDevice[]> =
    new ReplaySubject(1);
  private deviceHistory: _LocalstorageDevice[] = [];

  constructor(
    private router: Router,
    private contextRouteService: ContextRouteService
  ) {
    this.getHistoryFromLocalstorage();
    this.router.events
      .pipe(filter((event) => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        //@ts-ignore
        const currentContext = this.contextRouteService.getContextDataSnapshot(
          event.snapshot
        );
        if (currentContext) {
          this.activatedContextData = currentContext as ContextData;
          if (this.activatedContextData.context === 'device/:id') {
            console.log('DEVICE', this.activatedContextData, this.router.url);
            this.addDeviceToWatchHistory(
              this.activatedContextData.contextData as IManagedObject
            );
          }
        }
      });
  }

  private getHistoryFromLocalstorage() {
    debugger;
    const history =
      localStorage.getItem(_LocalStorageKeys.deviceHistory) || '[]';
    try {
      const historyArray: _LocalstorageDevice[] = JSON.parse(history);
      this.deviceHistory = historyArray;
      this.$deviceHistory.next(this.deviceHistory);
    } catch (e) {
      this.$deviceHistory.next([]);
    }
  }

  public async addDeviceToWatchHistory(device: IManagedObject) {
    this.deviceHistory = this.deviceHistory.filter((a) => device.id !== a.id);
    this.deviceHistory.unshift(this.transformDeviceToLastVisitDevice(device));
    if (this.deviceHistory.length > this.upperLimitVisitedDevices) {
      this.deviceHistory.splice(this.upperLimitVisitedDevices);
    }
    localStorage.setItem(
      _LocalStorageKeys.deviceHistory,
      JSON.stringify(this.deviceHistory)
    );
    this.$deviceHistory.next(this.deviceHistory);
  }

  public getDeviceWatchHistory() {
    return this.$deviceHistory;
  }

  private transformDeviceToLastVisitDevice(
    device: IManagedObject
  ): _LocalstorageDevice {
    return {
      id: device.id,
      lastVisit: new Date().toISOString(),
      lastRoute: this.router.url,
    };
  }
}
