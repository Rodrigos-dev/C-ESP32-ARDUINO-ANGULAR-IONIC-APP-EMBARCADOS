#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

BLEServer *pServer = NULL;
BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
String valor_return = "";
String valor;

class MyServerCallbacks : public BLEServerCallbacks {  
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Device connected");   
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Device disconnected");

    // Limpeza de variáveis
    valor_return = "";  // Limpa o valor acumulado

    // Reiniciar a publicidade para novos dispositivos
    pServer->startAdvertising();
}
};

class MyCallbacks : public BLECharacteristicCallbacks {
 
    void onWrite(BLECharacteristic *pCharacteristic) {
    Serial.println("onWrite");

    // Obtém o valor da característica BLE como String do Arduino
    String value = pCharacteristic->getValue().c_str();   

    if (value.length() > 0) {      
      String valor = String(value);

      valor_return += valor;
      pCharacteristic->setValue(valor_return.c_str());  // Atualizando o valor da característica com valor_return

      Serial.println("onWrite2");
      Serial.println(valor_return);

      if(valor_return == "1"){
        digitalWrite(2, HIGH);
        delay(1000);
        digitalWrite(4, LOW);        
      };

      if(valor_return == "2"){
        digitalWrite(4, HIGH);
        delay(1000);        
        digitalWrite(2, LOW);
      };

      //valor_return = "";//tem que limpar pq se nao fica concatenando cada vez que recebe um dado     

    }
  }

  void onRead(BLECharacteristic *pCharacteristic) {
    Serial.println("onRead");
    if (valor_return == "1") {
      pCharacteristic->setValue("led 2 high");
    } else {
      pCharacteristic->setValue("No action");
    }

    valor_return = "";//tem que limpar pq se nao fica concatenando cada vez que recebe um dado   
  }

};

void setup() {
  Serial.begin(115200);

  pinMode(2, OUTPUT);
  pinMode(4, OUTPUT);
  
  BLEDevice::init("ESP32_BLEE");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(BLEUUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b"));

  pCharacteristic = pService->createCharacteristic(
                      BLEUUID("beb5483e-36e1-4688-b7f5-ea07361b26a8"),
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_WRITE |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
  
  Serial.println("Waiting for a connection...");
}

void loop() {
  // Do other tasks if needed
}