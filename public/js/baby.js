// it is currently 8:04pm on a thursday night
// i have an urge to emulate the manchester baby i saw today

function parseAssembly(string)
{
    let instructions = string.split('\n');
    let binary = []
    for (let i=0; i < instructions.length; i++) {
        let splitInstruction = instructions[i].split(" ");
        let binInstruction = 0;
        switch (splitInstruction[0])
        {
            case ("JMP"):
            {
                binInstruction = splitInstruction[1] + '0000' + '0000000000000000'
                break;
            }
            case ("JRP"):
            {
                binInstruction = splitInstruction[1] + '1000' + '0000000000000000'
                break;
            }
            case ("LDN"):
            {
                binInstruction = splitInstruction[1] + '0100' + '0000000000000000'
                break;
            }
            case ("STO"):
            {
                binInstruction = splitInstruction[1] + '1100' + '0000000000000000'
                break;
            }
            case ("SUB"):
            {
                binInstruction = splitInstruction[1] + '0010' + '0000000000000000'
                break;
            }
            case ("CMP"):
            {
                binInstruction = '0000000000000000'+ '0110' + '0000000000000000'
                break;
            }
            case ("STP"):
            {
                binInstruction = '000000000000000011100000000000000000'
                break;
            }
            case ("DAT"):
            {
                binInstruction = splitInstruction[1];
                break;
            }
        }
        binary.push(parseInt(binInstruction, 2));
    }
    return binary;
}

class Baby
{
    constructor()
    {
        this.running = true;
        this.init();
    }

    // opcode 000 JMP s
    JMP(S) {
        this.programCounter = this.memory[S];
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
        if (this.accumulator < 0)
        {
            this.programCounter += 1;
        }
    }

    // opcode 111 STP
    // stop operation
    STP() {
        this.running = false;
    }

    debugInfo() {
        var accumElem = document.getElementById("accumulator");
        accumElem.innerText = "accumulator: " + this.accumulator.toString();

        var pc = document.getElementById("pc");
        pc.innerText = "pc: " + this.programCounter;

        var s = document.getElementById("s");
        s.innerText = "S: " + (this.memory[this.programCounter] & 0xFFF00000) >> 20;

        var opcode = document.getElementById("opcode");
        var val = (this.memory[this.programCounter] & 0xE0000);
        opcode.innerText = "opcode: " + (val >> 17).toString();

    }

    drawScreen() {
        let context = this.screen.getContext('2d');

        for (let y = 0; y < 32; y++)
        {
            for (let x = 0; x < 32; x++)
            {
                let maskedBit = (this.memory[y] >> x) & 1;
                if (maskedBit >> 32)
                {
                    context.fillRect(x*8, y*8, 8, 8);
                }
            }      
        }  
    }

    clearScreen() {
        let context = this.screen.getContext('2d');
        context.clearRect(0, 0, 256, 256)
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
                break
            }
            case (0b100):
            {
                this.JRP(s);
                break
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
                break
            }
            case (0b011):
            {
                this.CMP();
                break
            }
            case (0b111):
            {
                this.STP();
                return;
            }
        }
        this.programCounter++;
    }

    init() {
        // the screen to output to
        this.screen = document.getElementById("screen");

        // the next instruction in memory
        this.programCounter = 0;

        // stores results from arithmatic instructions
        this.accumulator = 0;

        // 1024 bytes of memory
        this.memory = Array(32).fill(0);

        let code = document.getElementById("code").value;
        let instructions = parseAssembly(code);
        for (let i=0; i < instructions.length; i++)
        {
            this.memory[i] = instructions[i];
        }
    }
}


// wait for window to load before executing important stuf
document.addEventListener('DOMContentLoaded', function () {

    // basic program to do 5 - 2
    // LDN 4 (0x00440000)
    // SUB 3 (0x00320000)
    // STP   (0x000E0000)
    // DAT 2 (0x00000002)
    // DAT 5 (0x00000005)


    var execute = document.getElementById('run');
    var stopBtn = document.getElementById('stop');
    var loop = 0;

    var baby = new Baby();

    stopBtn.onClick = function () {clearInterval(loop);}
    execute.onclick = function() {
        baby = new Baby();

        loop = setInterval(() => {
            baby.clearScreen();
            baby.cycle();
            baby.drawScreen();
            baby.debugInfo();


            if (!baby.running) { clearInterval(loop); }
        }, (1.2));

    }








})