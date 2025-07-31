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
  void onConnect(BLEServer *pServer) {
    deviceConnected = true;
    Serial.println("Device connected");
  }

  void onDisconnect(BLEServer *pServer) {
    deviceConnected = false;
    Serial.println("Device disconnected");

    // Limpeza de variáveis
    valor_return = "";  // Limpa o valor acumulado

    // Reiniciar a publicidade para novos dispositivos
    pServer->startAdvertising();
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
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_INDICATE);

  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();

  Serial.println("Waiting for a connection...");
}

void loop() {
  if (deviceConnected) {
    pCharacteristic->setValue("Hello from ESP32");
    pCharacteristic->notify();  // Envia uma notificação para o dispositivo central
    //Serial.println("Sent: Hello from ESP32"); // Mostrar mensagem enviada no monitor serial
    delay(1000);  // Altere conforme necessário
  }

  // Do other tasks if needed
}