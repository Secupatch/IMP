pin5 <- hardware.pin5;
pin7 <- hardware.pin7;

class ButtonState {
    pir1 = null;
    pir2 = null;
	startTime = null;
	state1On = false;
	state2On = false;
    
    constructor(pir1, pir2) {
        this.pir1 = pir1;
        this.pir2 = pir2;
		this.startTime = hardware.millis();
		pir1.configure(DIGITAL_IN_PULLUP, this.press);
		pir2.configure(DIGITAL_IN_PULLUP, this.press);
    }
    
	function press() {
		local localState1 = pir1.read();
		local localState2 = pir2.read();
		
		if(localState1 != 1){
			this.state1On = true;
		}		
		if(localState2 != 1){
			this.state2On = true;
		}

		local currentTime = hardware.millis();
		local timeDifference = currentTime - this.startTime;
		//1 Millisecond = 0.001 Seconds
		if(timeDifference < 10000) {
			imp.wakeup(0.5, this.press);
		} else {
			//waited for 10 seconds
			this.startTime = hardware.millis();
			if (this.state1On && this.state2On) {
				// when the button is pressed
				server.log("buttonPress="+state)
				agent.send("buttonPress","ALERT from IMP2 => " + state );
			} else {
				// when the button is released
				server.log("release");
			}
			state1On = false;
			state2On = false;
		}		
	}
}

pinState <- ButtonState(pin5, pin7)
