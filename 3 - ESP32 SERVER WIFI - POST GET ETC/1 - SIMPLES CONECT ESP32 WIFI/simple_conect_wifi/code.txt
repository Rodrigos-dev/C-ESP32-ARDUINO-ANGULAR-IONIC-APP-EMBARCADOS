#include <WiFi.h>

// Defina as credenciais das redes Wi-Fi
const char* ssid1 = "nome rede";
const char* password1 = "senha rede";

const char* ssid2 = "nome rede 2";
const char* password2 = "senha rede 2";

void setup() {
  pinMode(2, OUTPUT);
  pinMode(4, OUTPUT);

  Serial.begin(115200);

  // Tenta conectar à primeira rede Wi-Fi
  connectToWiFi(ssid1, password1);

  // Se a conexão com a primeira rede falhar, tenta a segunda rede
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi(ssid2, password2);
  }
}


void loop() {
  
}


void connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  int retries = 0;
  const int maxRetries = 10;

  while (WiFi.status() != WL_CONNECTED && retries < maxRetries) {
    digitalWrite(4, LOW);
    digitalWrite(2, HIGH);
    delay(1000);
    Serial.print("Connecting to ");
    Serial.println(ssid);
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(4, HIGH);
    digitalWrite(2, LOW);
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.print("Failed to connect to ");
    Serial.println(ssid);
  }
}