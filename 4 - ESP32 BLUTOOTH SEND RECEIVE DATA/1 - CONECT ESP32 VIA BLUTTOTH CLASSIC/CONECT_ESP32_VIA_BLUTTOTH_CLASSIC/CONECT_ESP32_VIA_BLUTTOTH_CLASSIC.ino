#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200); // Inicializa a comunicação serial para o monitor serial
  SerialBT.begin("ESP32test"); // Nome do dispositivo Bluetooth
  Serial.println("O dispositivo Bluetooth está pronto para emparelhar");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    SerialBT.write(c); // Envia o dado recebido do monitor serial via Bluetooth
  }

  if (SerialBT.available()) {
    char c = SerialBT.read();
    Serial.write(c); // Envia o dado recebido via Bluetooth para o monitor serial
  }
}
