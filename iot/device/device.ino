#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978

#include <EEPROM.h> 
#include <Time.h> 
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <iarduino_RTC.h> 

//echo -e -n "N$(date +%s)" > /dev/ttyUSB0

LiquidCrystal_I2C lcd(0x3F, 16, 2);
iarduino_RTC rtc(RTC_DS1302,9,10,11);

int soundPin = 2;
int muteButtonPin = 3;
int backlightButtonPin = 4;
int refreshButtonPin = 5;
int secretButtonPin = 6;
int updateLed = 7;
int soundLed = 8;
int potentiometer = A0;
int soundSensor = A1;

boolean isMuted = false;
boolean isBacklightOn = true;
int storedNoizeLevel = 0;
int noizeLevel = 250;

time_t tournament;

void setup()
{
  pinMode(muteButtonPin, INPUT);
  digitalWrite(muteButtonPin, HIGH);
  pinMode(backlightButtonPin, INPUT);
  digitalWrite(backlightButtonPin, HIGH);
  pinMode(refreshButtonPin, INPUT);
  digitalWrite(refreshButtonPin, HIGH);
  pinMode(secretButtonPin, INPUT);
  digitalWrite(secretButtonPin, HIGH);
  pinMode(soundPin, OUTPUT);
  pinMode(updateLed, OUTPUT);
  pinMode(soundLed, OUTPUT);
  lcd.begin();
  lcd.backlight();
  Serial.begin(9600);
  randomSeed(analogRead(0));
  load();
  rtc.begin();
  rtc.gettime("");
  setTime(rtc.Hours,rtc.minutes,rtc.seconds,rtc.day, rtc.month, rtc.year);
}

void loop()
{
  delay(100);
  time_t t = now();
  noizeLevel = analogRead(potentiometer);
  int s = analogRead(soundSensor);
  int delta_s = abs(storedNoizeLevel - s);
  storedNoizeLevel = s;
  if(delta_s * 10 > noizeLevel){
    isBacklightOn = true;
    lcd.backlight();
  }   
  if(digitalRead(muteButtonPin) == LOW){
    isMuted = !isMuted;
    isBacklightOn = true;
    lcd.backlight();
    delay(250);
  }
  if(digitalRead(backlightButtonPin) == LOW){
    isBacklightOn = !isBacklightOn;
    if(isBacklightOn) lcd.backlight();
    else lcd.noBacklight();
    delay(100);
  }
  if(digitalRead(refreshButtonPin) == LOW){
    lcd.clear();
    lcd.print("Loading...");
    Serial.write("UPD");
    wait(1000);
    lcd.clear();
  }
  if(digitalRead(secretButtonPin) == LOW){
    gf();
  }
  if (Serial.available()) {
    lcd.clear();
    lcd.print("Loading...");
    switch(Serial.read()){
      case 'N':
        t = Serial.parseInt();
        setTime(t);
        rtc.settime(second(t),minute(t), hour(t), day(t), month(t), year(t), weekday(t));
        break;
      case 'T':
        tournament = Serial.parseInt();
        save();
        break;
      default:
        break;
    }    
    lcd.clear();
  }
  
  long delta = tournament - t;
  if (delta == 0){
    while(digitalRead(muteButtonPin) != LOW) {
      lcd.backlight();
      lcd.clear();
      lcd.print("  TOURNAMENT   ");
      lcd.setCursor(0,1);  
      lcd.print("    BEGIN!     ");
      piiik();
      wait(1000);
    }    
  } else {
    lcd.clear();
    lcd.print(String(day(t)) + "." + String(month(t)) + "   " 
            + String(hour(t)) + ":" + String(minute(t)) + ":" + String(second(t)));
    lcd.setCursor(0,1);  
    if(delta < 0){
      lcd.print("Tournam. active!");
    } else {
      lcd.print(String(delta/86400) + "d " 
              + String(hour(delta)) + ":" + String(minute(delta)) + ":" + String(second(delta)));
    }
  }
  
  if(isMuted){
    digitalWrite(soundLed, LOW);
  } else {
    digitalWrite(soundLed, HIGH);
  }
  
          
}

void save(){
  EEPROM.write(0, hour(tournament));
  EEPROM.write(1, minute(tournament));
  EEPROM.write(2, second(tournament));
  EEPROM.write(3, day(tournament));
  EEPROM.write(4, month(tournament));
  EEPROM.write(5, year(tournament) % 100);
  
}

void load(){
  //tournament = EEPROM.read(0);
  
  int h = EEPROM.read(0);
  int m = EEPROM.read(1);
  int s = EEPROM.read(2);
  int d = EEPROM.read(3);
  int mn = EEPROM.read(4);
  int y = EEPROM.read(5) + 2000;
  // begin костыль
  time_t t0 = now();
  setTime(h,m,s,d,mn,y);
  tournament = now();
  setTime(t0);
  // end костыль
  //tournament = h * 3600 + m * 60 + s + d * 86400 + mn * 2628000 + y * 31536000;
  
}

void pik(){
  if(isMuted) return;
  tone(soundPin, 1000, 500);
}
  
void piiik(){    
    if (isMuted) {return;}    
    int melody[] = { NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4 };
  
    int noteDurations[] = { 4, 8, 8, 4, 4, 4, 4, 4 };
  
    for (int thisNote = 0; thisNote < 8; thisNote++) {
      int noteDuration = 1000 / noteDurations[thisNote];
      tone(soundPin, melody[thisNote], noteDuration);
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);
      noTone(soundPin);
    }
}

void wait(int ms){
  int n = 10;
  for(int i = 0; i < n; i ++){
    digitalWrite(updateLed, HIGH);
    delay(ms / (2 * n));
    digitalWrite(updateLed, LOW);
    delay(ms / (2 * n) );
  }
}

void gf(){
  if (isMuted) return;
  int melody[] = {
    NOTE_F4, NOTE_C4, NOTE_A3, NOTE_C4, NOTE_A3, NOTE_F4,
    NOTE_F4, NOTE_C4, NOTE_A3, NOTE_C4, NOTE_A3, NOTE_F4,
  
    NOTE_E4, NOTE_C4, NOTE_G3, NOTE_C4, NOTE_G3, NOTE_E4,
    NOTE_E4, NOTE_C4, NOTE_G3, NOTE_C4, NOTE_G3, NOTE_E4,
  
    NOTE_E4, NOTE_CS4, NOTE_A3, NOTE_CS4, NOTE_A3, NOTE_E4,
    NOTE_E4, NOTE_CS4, NOTE_A3, NOTE_CS4, NOTE_A3, NOTE_E4,
  
    NOTE_D4, NOTE_E4, NOTE_F4, NOTE_A4, NOTE_G4, NOTE_A4, NOTE_C4,
    NOTE_D4, NOTE_E4, NOTE_F4, NOTE_E4, NOTE_G4, NOTE_A4, NOTE_G4, NOTE_F4,
  
    NOTE_F4, NOTE_F4, NOTE_F4, NOTE_A4, NOTE_A4, NOTE_G4, NOTE_F4,
    NOTE_A4, NOTE_A4, NOTE_A4, NOTE_G4, NOTE_A4, NOTE_G4, NOTE_F4,
    NOTE_F4, NOTE_F4, NOTE_F4, NOTE_A4, NOTE_A4, NOTE_G4, NOTE_F4,
  
    NOTE_A4, NOTE_A4, NOTE_A4, NOTE_CS5, NOTE_CS5, NOTE_CS5,
    NOTE_F4, NOTE_F4, NOTE_F4, NOTE_A4, NOTE_A4, NOTE_G4, NOTE_F4
  };

  int noteDurations[] = {
    8,8,8,8,8,8,
    8,8,8,8,8,8,
  
    8,8,8,8,8,8,
    8,8,8,8,8,8,
  
    8,8,8,8,8,8,
    8,8,8,8,8,8,
  
    2, 3, 3, 4, 4, 2, 2,
    2, 3, 3, 4, 4, 2, 2, 2,
  
    8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8,
  
    3, 3, 3, 3, 3, 2,
    3, 3, 3, 3, 3, 3, 3
    
  };

  int lengthOfMelody = sizeof(melody)/sizeof(melody[0]);
  
  lcd.clear();
  lcd.print(" Nunquam sapiunt ");
  lcd.setCursor(0,1);
  lcd.print("   omnia quae    ");
  
  for (int thisNote = 0; thisNote < lengthOfMelody; thisNote++) {    
      int noteDuration = 1000 / noteDurations[thisNote];
      tone(soundPin, melody[thisNote],noteDuration);
      int pauseBetweenNotes = noteDuration * 1.30;
      delay(pauseBetweenNotes);
      noTone(soundPin);
    }

}
