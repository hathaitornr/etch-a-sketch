#define SENSORPINA A1 // x axis
 //TODO: define other sensor inputs
#define SENSORPINB A0 // y axis
#define FSR A2 // add minions

const int buttonPin = 2;     // the number of the pushbutton pin
int buttonState = 0;         // variable for reading the pushbutton status
const int ledPin =  10;      // the number of the LED pin
unsigned long targetTime=0;
const unsigned long interval=2500; //TODO: How fast should we read
int fsrValue = 0;     

void setup(){
// begin the serial connection with a baudrate of 115200
  Serial.begin(115200); 

  pinMode(buttonPin, INPUT);
  pinMode(FSR, INPUT);
  pinMode(SENSORPINA, INPUT);
  pinMode(SENSORPINB, INPUT);
  
  pinMode(ledPin, OUTPUT);
}


void loop(){
	if(millis()>=targetTime){
		targetTime= millis()+interval;
		Serial.println(analogRead(SENSORPINA));
     //TODO: Add other sensor read outs
    Serial.println(analogRead(SENSORPINB));

     //TODO: convert values into a string https://www.arduino.cc/en/Tutorial/StringConstructors
    String stringX = String(analogRead(A1), DEC);
    String stringY = String(analogRead(A0), DEC);
    
		 //TODO: combine them into a string that can be understood by server.js
    String combinedString = stringX + "," + stringY + "\r\n";
    
		 //TODO: send the string over serial
    Serial.println(combinedString);
    delay(30);

	}
	// TODO: Detect if you want to reset the screen(shake the etch-a-sketch)
  // TODO: write the reset message(see server.js) to the serial port
  buttonState = digitalRead(buttonPin);
  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH); // turn LED on
    String reset = String("rst\r\n");
    Serial.println(reset);
  }

  fsrValue = analogRead(FSR);
  if (fsrValue > 500){
    digitalWrite(ledPin, HIGH); // turn LED on
    Serial.println("minion\r\n");
//    delay(100);
  }

  else if (buttonState == LOW or fsrValue < 10) {
    digitalWrite(ledPin, LOW); // turn LED off
  }
}
