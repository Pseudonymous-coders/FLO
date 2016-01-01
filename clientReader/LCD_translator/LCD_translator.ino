#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

#define conn 10
#define conne 9
#define wait 8
#define fo 7
#define app 6
#define napp 1

int lastconn = 0;
int lastconne = 0;
int lastwait = 0;
int lastfo = 0;
int lastapp = 0;
int lastnapp = 0;


void lcds(String first, String second="")
{
    lcd.setCursor(0,0);
    lcd.print(first);
    lcd.setCursor(0,1);
    lcd.print(second);
}

void setup() {
  pinMode(conn, INPUT);
  pinMode(conne, INPUT);
  pinMode(wait, INPUT);
  pinMode(fo, INPUT);
  pinMode(app, INPUT);
  pinMode(napp, INPUT);
  lcd.begin(16, 2);
  lcd.print("Booting...");
}

void loop() {
int connv = digitalRead(conn);
int connev = digitalRead(conne);
int waitv = digitalRead(wait);
int fov = digitalRead(fo);
int appv = digitalRead(app);
int nappv = digitalRead(napp);
  if(lastconn == 0 && connv == 1)
  {
    lcds("Connecting", "Please Wait...");
    lastconn = 1;
  }
  else if(lastconn == 1 && connv == 0)
  {
    lcd.clear();
    lastconn = 0;
  }
  else if(lastconne == 0 && connev == 1)
  {
    lcds("Connected", "");
    lastconne = 1;
  }
  else if(lastconne == 1 && connev == 0)
  {
    lcd.clear();
    lastconne = 0;
  }
  else if(lastwait == 0 && waitv == 1)
  {
    lcds("Waiting for card", "");
    lastwait = 1;
  }
  else if(lastwait == 1 && waitv == 0)
  {
    lcd.clear();
    lastwait = 0;
  }
  else if(lastfo == 0 && fov == 1)
  {
    lcds("Found card", "");
    lastfo = 1;
  }
  else if(lastfo == 1 && fov == 0)
  {
    lcd.clear();
    lastfo = 0;
  }
  else if(lastapp == 0 && appv == 1)
  {
    lcds("Approved!", "");
    lastapp = 1;
  }
  else if(lastapp == 1 && appv == 0)
  {
    lcd.clear();
    lastapp = 0;
  }
  else if(lastnapp == 0 && nappv == 1)
  {
    lcds("Not Approved", "Ask facilitator");
    lastnapp = 1;
  }
  else if(lastnapp == 1 && nappv == 0)
  {
    lcd.clear();
    lastnapp = 0;
  }
  delay(100);
}


