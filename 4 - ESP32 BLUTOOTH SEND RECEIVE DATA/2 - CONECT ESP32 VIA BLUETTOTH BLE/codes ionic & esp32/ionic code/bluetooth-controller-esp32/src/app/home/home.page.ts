import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BleClient, textToDataView } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  devices: any[] = [];
  connectedDevice: any = null;
  serviceUuid: string = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'; // UUID do serviço
  characteristicUuid: string = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'; // UUID da característica

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.initializeBluetooth();
    });
  }

  async initializeBluetooth() {
    try {
      await BleClient.initialize();
      console.log('Bluetooth initialized');
      this.checkPermissions();
    } catch (error) {
      console.error('Error initializing Bluetooth', error);
    }
  }

  async checkPermissions() {
    console.log('Checking permissions');
    // Adicione a lógica para verificar e solicitar permissões se necessário
  }

  async scanDevices() {
    try {
      const result = await BleClient.requestDevice({ allowDuplicates: false, optionalServices: [this.serviceUuid] });
      this.devices = [result];
      console.log('Scanned devices', this.devices);
    } catch (error) {
      console.error('Error scanning devices', error);
    }
  }

  async connectToDevice(device: any) {
    try {
      await BleClient.connect(device.deviceId);
      this.connectedDevice = device;
      console.log('Connected to', device.name);

      const servicesUuids = await BleClient.getServices(device.deviceId);
      console.log('Services:', servicesUuids);

      //this.serviceUuid = servicesUuids.services[0].uuid; 
      //this.characteristicUuid = servicesUuids.services[0].characteristics[0].uuid;      

    } catch (error) {
      console.error('Error connecting to device', error);
    }
  }

  async disconnectDevice() {
    if (this.connectedDevice) {
      await BleClient.disconnect(this.connectedDevice.deviceId);
      console.log('Disconnected from', this.connectedDevice.name);
      this.connectedDevice = null;
      window.location.reload();
    } else {
      console.warn('No device connected');
    }
  }

  async sendData(data: string) {
    if (!this.connectedDevice) {
      console.error('No connected device');
      return;
    }

    try {
      const buffer = new TextEncoder().encode(data).buffer;
      const dataView = new DataView(buffer);

      console.log(data, 'Response decode:',dataView);

      await BleClient.write(
        this.connectedDevice.deviceId,
        this.serviceUuid,
        this.characteristicUuid,
        dataView
        //textToDataView(data)
      );

      const response: any = await BleClient.read(
        this.connectedDevice.deviceId,
        this.serviceUuid,
        this.characteristicUuid,
      );

      console.log('Response from ESP32222:',response);
      const decodedValue = this.decodeData(response);
      console.log(decodedValue, 'Response from ESP32:',response, response.value);
      
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error sending data', error);
    }
  }

  decodeData(dataView: DataView): string {
    const byteArray = new Uint8Array(dataView.buffer);
    return String.fromCharCode(...byteArray);
  }
}