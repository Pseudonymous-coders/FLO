#include <LTask.h>
#include <LWiFi.h>
#include <LWiFiClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define IP "192.168.43.195"
#define PORT 9191
#define RST 9
#define SS 8

#define red A2
#define green A1
#define white A0

#define conn 7
#define conne 6
#define wait 5
#define fo 4
#define app 3
#define napp 2

byte sector = 0;
byte blockAddr = 0;
byte trailerBlock = 1;
long int times = 0;
String line1="";
String line2="";
LWiFiClient client;
MFRC522 mfrc522(SS, RST);
MFRC522::MIFARE_Key key;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(white, OUTPUT);
  pinMode(conn, OUTPUT);
  pinMode(conne, OUTPUT);
  pinMode(wait, OUTPUT);
  pinMode(fo, OUTPUT);
  pinMode(app, OUTPUT);
  pinMode(napp, OUTPUT);
  digitalWrite(conn, LOW);
  digitalWrite(conne, LOW);
  digitalWrite(wait, LOW);
  digitalWrite(fo, LOW);
  digitalWrite(app, LOW);
  digitalWrite(napp, LOW);
  analogWrite(red, 0);
  analogWrite(green, 0);
  analogWrite(white, 0);
  //w(0);
  digitalWrite(conn, HIGH);
  LWiFi.begin();
  while (!(LWiFi.connect("smerkous", LWiFiLoginInfo(LWIFI_WPA, "holycrap")))) delay(1);
 // w(220);
  //delay(600);
  SPI.begin();
  mfrc522.PCD_Init();
  for (byte i = 0; i < 6; i++) {
     key.keyByte[i] = 0xFF;
  }
  analogWrite(white, 255);
  digitalWrite(conn, LOW);
  digitalWrite(conne, HIGH);
  delay(1000);
  digitalWrite(conne, LOW);
  delay(500);
  digitalWrite(wait, HIGH);
 // w(400);
  //send("HERE");
}

void loop() {
    /*if(times++>700)
    {
      send("HERE");
      times=0;
    }*/
    delay(3);
    if ( ! mfrc522.PICC_IsNewCardPresent())
        return;
    if ( ! mfrc522.PICC_ReadCardSerial())
        return;
    byte piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
    
    if (    piccType != MFRC522::PICC_TYPE_MIFARE_MINI
        &&  piccType != MFRC522::PICC_TYPE_MIFARE_1K
        &&  piccType != MFRC522::PICC_TYPE_MIFARE_4K) {
          delay(100);
        return;
    }
    analogWrite(white, 0);
  byte status;
  byte buffer[18];
  byte size = sizeof(buffer);
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    delay(100);
    return;
  }
  status = mfrc522.MIFARE_Read(blockAddr, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    delay(100);
  }
      digitalWrite(wait, LOW);
    digitalWrite(fo, HIGH);
    while (!(client.connect(IP, PORT))) delay(5);
    const String ID = dump(buffer, size);
    client.println(ID);
    String full = "66";
    digitalWrite(fo, LOW);
    int last = 0;
    while (client)
    {
      int v = client.read();
      if (v != -1)
      {
        last = v;
        full += (String)v;
      }
      else
      {
        client.stop();
      }
    }
    if(last == 65)
    {
      while(mfrc522.MIFARE_Read(blockAddr, buffer, &size) == MFRC522::STATUS_OK)
      {
      analogWrite(red, 255);
      digitalWrite(napp, HIGH);
      delay(200);
      }
      analogWrite(red, 0);
      digitalWrite(napp, LOW);
      //w(1023);
    }
    else
    {
      while(mfrc522.MIFARE_Read(blockAddr, buffer, &size) == MFRC522::STATUS_OK)
      {
      digitalWrite(app, HIGH);
      analogWrite(green,255);
      }
      delay(200);
      analogWrite(green, 0);
      digitalWrite(app, LOW);
      //w(700);
    }
    analogWrite(white, 255);
    digitalWrite(wait, HIGH);
      mfrc522.PICC_HaltA();
      mfrc522.PCD_StopCrypto1();
   // w(400);
}

/*void send(char sender[])
{
    while (!(client.connect(IP, PORT))) delay(5);
    client.println(sender);
    client.stop();
}*/

String dump(byte *buffer, byte bufferSize) {
    String out = "";
    for (byte i = 0; i < bufferSize; i++) {
        out += String(buffer[i] < 0x10 ? " 0" : " ") + String(buffer[i], HEX);
    }
    out.toUpperCase();
    out.replace(" ", "");
    return out;
}


