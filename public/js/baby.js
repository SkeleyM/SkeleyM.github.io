// it is currently 8:04pm on a thursday night
// i have an urge to emulate the manchester baby i saw today

class Baby
{
    constructor()
    {
        this.screen = document.getElementById("screen");

        this.programCounter = 0;
        // 32 bit int, stores results from arithmatic instructions
        this.accumulator = 0;

        // 1024 bytes of memory
        this.memory = Array(32).fill(0);
    }

    // opcode 000 JMP s
    JMP(S) {
        this.programCounter = S;
    }

    // opcode 100 JRP S
    // jump to the instruction at program counter + s
    JRP(S) {
        this.programCounter += S;
    }

    // opcode 010 LDN S
    LDN(S) {
        this.accumulator = -this.memory[S];
    }

    // opcode 110 LDN S
    // store number in accumulator to memory adress S
    STO(S) {
        this.memory[S] = this.accumulator;
    }

    // opcode 110 
    SUB(S) {
        this.accumulator -= this.memory[S];
    }

    // opcode 011 (or 101?) CMP
    CMP() {
        if (!(this.accumulator >> 31))
        {
            this.programCounter += 1;
        }
    }

    // opcode 111 STP
    // stop operation
    STP() {

    }

    loadProgram() {
        let code = document.getElementById("code").value;
        let splitCode = code.split('\n');
        for (let i=0; i < 32; i++)
        {
            this.memory[i] = parseInt(splitCode[i], 2)
        }
    }

    debugInfo() {
        var accumElem = document.getElementById("accumulator");
        accumElem.innerText = "accumulator: " + this.accumulator.toString();

        var pc = document.getElementById("pc");
        pc.innerText = "pc: " + this.programCounter;

        var opcode = document.getElementById("opcode");
        var val = (this.memory[this.programCounter] & 0xE0000);
        opcode.innerText = "opcode: " + (val >> 17).toString();

    }

    drawScreen() {
        var context = this.screen.getContext('2d');

        for (let y = 0; y < 32; y++)
        {
            
            for (let x = 1; x < 32; x++)
            {
                let maskedBit = (this.memory[y] >> 32-x) & 1;
                if (maskedBit)
                {
                    context.fillRect(x, y, 1, 1);
                }

            }
            
        }
        
    }
    cycle() {
        // bits 0-12 represented the adress of the operand
        // bits 13-15 were the opcode

        var s = (this.memory[this.programCounter] & 0xFFF00000) >> 20;
        var opcode = (this.memory[this.programCounter] & 0xE0000) >> 17;

        switch (opcode)
        {
            case (0b000):
            {
                this.JMP(s);
            }
            case (0b100):
            {
                this.JRP(s);
            }
            case (0b010):
            {
                this.LDN(s);
                break
            }
            case (0b110):
            {
                this.STO(s);
                break
            }
            case (0b001 || 0b101):
            {
                this.SUB(s);
            }
            case (0b011):
            {
                this.CMP();
            }
            case (0b111):
            {
                this.STP();
            }
        }
    }
}


// wait for window to load before executing important stuf
document.addEventListener('DOMContentLoaded', function () {
    const baby = new Baby();



    let execute = document.getElementById('run');
    execute.onclick = function() {
        baby.loadProgram()
        let running = setInterval(() => {
            
            baby.cycle();
            baby.drawScreen();
            baby.debugInfo();
    
            let stop = document.getElementById('stop');
            stop.onclick(function () {clearInterval(running)});
        }, (10));
    }

    

    

    
    
    
})
