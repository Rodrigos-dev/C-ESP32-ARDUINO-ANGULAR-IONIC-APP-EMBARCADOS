#include <WiFi.h>

#include <WiFiClient.h>
#include <WiFiServer.h>
#include <ArduinoJson.h>

// Defina as credenciais das redes Wi-Fi
const char* ssid1 = "nome rede";
const char* password1 = "senha rede";

const char* ssid2 = "nome rede 2";
const char* password2 = "senha rede 2";


unsigned long previousMillis = 0;
const long interval = 10000;  // Intervalo para verificar a conexão (em milissegundos)

int a = 1;
int b = 2;

WiFiServer server(80);
WiFiClient client;
unsigned long delayClose;

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

  server.begin();
}

void loop() {
  //Verifica o status da conexão Wi-Fi periodicamente
  unsigned long currentMillis = millis();

  // Verifica o status da conexão Wi-Fi a cada intervalo definido
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    checkWiFiConnection();
  }

  // Verifica se há um cliente conectado
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client.");
    String currentLine = "";
    String method = "";
    String path = "";
    bool currentLineIsBlank = true;

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);

        // Separamos a primeira linha para capturar o método e o path
        if (currentLine.endsWith("\r")) {
          if (method == "") {
            // Divide a primeira linha da requisição para obter o método e o path
            int methodEnd = currentLine.indexOf(' ');
            method = currentLine.substring(0, methodEnd);
            int pathEnd = currentLine.indexOf(' ', methodEnd + 1);
            path = currentLine.substring(methodEnd + 1, pathEnd);
          }
          currentLine = "";
        } else {
          currentLine += c;
        }

        // Se a linha estiver em branco, a requisição HTTP terminou
        if (c == '\n' && currentLineIsBlank) {
          // Verifica o método e o caminho
          if (method == "GET" && path == "/fullDados") {
            handleGetFullDados(client);
          } else if (method == "GET" && path == "/dadosA") {
            handleGetDadosA(client);
          } else if (method == "POST" && path == "/login") {
            handlePostDados(client, currentLine);
          } else if (method == "GET" && path == "/externalData") {
            getDataFromExternalAPI(client);
          } else {
            // Responde com 404 se a rota não for encontrada
            client.println("HTTP/1.1 404 Not Found");
            client.println("Content-type:text/plain");
            client.println();
            client.println("404 Not Found");
          }

          // Finaliza a resposta
          client.println();
          break;
        }

        // Detecta o final de uma linha (após um \r\n)
        if (c == '\n') {
          currentLineIsBlank = true;
        } else if (c != '\r') {
          currentLineIsBlank = false;
        }
      }
    }
    // Fecha a conexão
    client.stop();
    Serial.println("Client Disconnected.");
  }
}


//abaixo funcoes

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


void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(4, LOW);
    digitalWrite(2, HIGH);
    Serial.println("Disconnected. Trying to reconnect...");

    // Tenta reconectar às redes Wi-Fi
    connectToWiFi(ssid1, password1);
    if (WiFi.status() != WL_CONNECTED) {
      connectToWiFi(ssid2, password2);
    }
  } else {
    digitalWrite(4, HIGH);
    digitalWrite(2, LOW);
  }
}


void handleGetFullDados(WiFiClient& client) {
  Serial.println("aaaaaa");
  // Envia uma resposta ao cliente
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:application/json");
  client.println();

  // Cria um objeto JSON com os valores de a e b
  StaticJsonDocument<200> doc;
  doc["a"] = a;
  doc["b"] = b;
  String jsonResponse;
  serializeJson(doc, jsonResponse);

  // Envia o objeto JSON
  client.println(jsonResponse);
}

void handleGetDadosA(WiFiClient& client) {
  // Envia uma resposta ao cliente
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:application/json");
  client.println();

  // Cria um objeto JSON com os valores de a e b
  StaticJsonDocument<200> doc;
  doc["a"] = a;

  String jsonResponse;
  serializeJson(doc, jsonResponse);

  // Envia o objeto JSON
  client.println(jsonResponse);
}


void handlePostDados(WiFiClient& client, String& requestBody) {
  // Lê todo o corpo da requisição
  String body = "";
  while (client.available()) {
    char c = client.read();
    body += c;
  }

  // Parseia o JSON recebido
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    client.println("HTTP/1.1 400 Bad Request");
    client.println("Content-type:application/json");
    client.println();
    client.println("{\"error\":\"Invalid JSON\"}");
  } else {
    // Obtém os valores de email e senha
    const char* email = doc["email"];
    const char* senha = doc["senha"];

    // Envia uma resposta ao cliente
    client.println("HTTP/1.1 200 OK");
    client.println("Content-type:application/json");
    client.println();

    // Cria um objeto JSON com os valores recebidos
    StaticJsonDocument<200> responseDoc;
    responseDoc["email"] = email;
    responseDoc["senha"] = senha;
    String jsonResponse;
    serializeJson(responseDoc, jsonResponse);

    // Envia o objeto JSON
    client.println(jsonResponse);
  }
}


//get em api externa
void getDataFromExternalAPI(WiFiClient &client) {
  Serial.println("Getting data from JSONPlaceholder...");

  String response = "";  
  if (client.connect("jsonplaceholder.typicode.com", 80)) {
    client.println("GET /posts/1 HTTP/1.1");  // Alterado para obter o post específico com ID 1
    client.println("Host: jsonplaceholder.typicode.com");
    client.println("Connection: close");
    client.println();
    
    // Aguarda a resposta da API e lê os dados
    while (client.connected() || client.available()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        response += c; // Acumula os dados recebidos na variável response
      }
    }
  } else {
    Serial.println("Connection to JSONPlaceholder failed");
    return;
  }

  // Apenas exibe os dados recebidos da API no monitor serial
  Serial.println(response);   
  
  // Envia a resposta HTTP completa com um valor true (simulando uma resposta de servidor)
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();
  client.println("true"); // Envia apenas "true" como resposta

  client.stop();
}