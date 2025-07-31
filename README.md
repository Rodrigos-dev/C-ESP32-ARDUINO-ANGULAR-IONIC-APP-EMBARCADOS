🔌 Projetos com ESP32
Este repositório contém uma coleção de projetos utilizando a placa ESP32, explorando diferentes formas de comunicação e integração com dispositivos móveis, servidores e sensores.

📁 Estrutura do Repositório
2 - PROJETOS ESP32
Contém exemplos gerais e testes com funcionalidades básicas da ESP32, primeiros experimentos.

3 - ESP32 SERVER WIFI - POST GET ETC
Projetos com ESP32 atuando como servidor via Wi-Fi, recebendo e enviando dados usando métodos HTTP como POST e GET. Ideal para criar APIs REST simples diretamente na ESP32.

4 - ESP32 BLUETOOTH SEND RECEIVE DATA
Exemplos de comunicação via Bluetooth (BLE ou Clássico). A ESP32 envia e recebe dados entre dispositivos móveis ou outros microcontroladores compatíveis com Bluetooth.

5 - ESP32 E IONIC
Projeto que demonstra a integração entre um aplicativo móvel criado com Ionic + Angular e a ESP32 via Wi-Fi.

O aplicativo envia requisições HTTP para o IP local da ESP32.

A ESP32 atua como servidor e responde a esses comandos, controlando LEDs (acendendo e apagando).

Lida com problemas comuns como CORS para permitir a comunicação entre diferentes origens.

📲 Tecnologias Utilizadas
ESP32 (Arduino / C++)

Wi-Fi HTTP Server

Bluetooth

Ionic + Angular

HTML / JS

CORS Headers

🚀 Como Executar o Projeto ESP32 E IONIC
ESP32

Compile o código da ESP32 com Arduino IDE ou PlatformIO.

Conecte-se à mesma rede Wi-Fi do celular.

A ESP32 atuará como servidor com IP fixo ou dinâmico.

App Ionic

Instale as dependências:

npm install
Rode o app:

ionic serve
Acesse a interface e envie comandos via botões para acender/apagar LEDs.
