import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular'; // Importa o ToastController
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private toastController: ToastController) { }
  inputText: string = '';
  lights: { [key: string]: boolean } = {
    on: false,
    off: false,
    blink: false,
    close: false,
    status: false,
    Rastrear: false
  };

  discoveredDevices: string[] = []; // Lista de dispositivos descobertos

  ngOnInit() {
  }

  // Função para exibir um toast
  async presentToast(message: string, duration: number = 2000, position?: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position ? position : 'bottom', // Define a posição do toast
      color: 'dark', // Define a cor do toast (opcional)
    });
    toast.present();
  }

  clearInput() {
    console.log(this.inputText, 'teste')
    this.inputText = ''; // Limpa o valor do input
  }

  async toggleLight(button: string) {
    // Alterna o estado da lâmpada

    if (button === 'on') {

      this.presentToast(`on: ${this.inputText}`, 500, 'middle');

      try {
        
        const response = await axios.get(`http://${this.inputText}/on`);

        this.lights['on'] = !this.lights['on']
        this.lights['off'] = false
        this.lights['blink'] = false
        this.lights['close'] = false
        this.lights['status'] = false
        this.lights['test-esp-casa'] = false        

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }

    }

    else if (button === 'off') {
      try {
        this.presentToast(`off: ${this.inputText}`, 500, 'middle');

        const response = await axios.get(`http://${this.inputText}/off`);

        this.lights['on'] = false
        this.lights['off'] = !this.lights['off']
        this.lights['blink'] = false
        this.lights['close'] = false
        this.lights['status'] = false
        this.lights['test-esp-casa'] = false

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }
    }

    else if (button === 'blink') {

      this.presentToast(`blink: ${this.inputText}`, 500, 'middle');

      try {
        const response = await axios.get(`http://${this.inputText}/blink`);

        this.lights['on'] = false
        this.lights['off'] = false
        this.lights['blink'] = !this.lights['blink']
        this.lights['close'] = false
        this.lights['status'] = false
        this.lights['test-esp-casa'] = false

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }
    }

    else if (button === 'close') {

      this.presentToast(`close: ${this.inputText}`, 500, 'middle');

      try {
        const response = await axios.get(`http://${this.inputText}/close`);

        this.lights['on'] = false
        this.lights['off'] = false
        this.lights['blink'] = false
        this.lights['close'] = !this.lights['close']
        this.lights['status'] = false
        this.lights['test-esp-casa'] = false

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }
    }

    else if (button === 'status') {

      this.presentToast(`status: ${this.inputText}`, 500, 'middle');

      try {
        const response = await axios.get(`http://${this.inputText}/status`);

        this.lights['on'] = false
        this.lights['off'] = false
        this.lights['blink'] = false
        this.lights['close'] = false
        this.lights['status'] = !this.lights['status']
        this.lights['test-esp-casa'] = false

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }
    }

    else if (button === 'test-esp-casa') {

      this.presentToast(`on: ${this.inputText}`, 500, 'middle');

      try {
        
        const response = await axios.get(`http://${this.inputText}/dadosA`);

        this.lights['on'] = false
        this.lights['off'] = false
        this.lights['blink'] = false
        this.lights['close'] = false
        this.lights['status'] = false
        this.lights['test-esp-casa'] = !this.lights['test-esp-casa']        

        console.log('Resposta do servidor:', response.data);
        this.presentToast(`Requisição bem-sucedida ${JSON.stringify(response.data)}`, 3000);
      } catch (error) {
        console.error('Erro ao fazer requisição GET:', error);
        this.presentToast(`Erro: ${error}`, 5000);
      }


  }

  }

}
