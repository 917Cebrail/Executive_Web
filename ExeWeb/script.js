class Executive {
    constructor() {
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this._ram = new Array(256).fill(0);
    }

    AND(operand1, operand2) {
        this.C = operand1 & operand2;
    }

    NAND(operand1, operand2) {
        this.C = ~(operand1 & operand2) & 0xFF;
    }

    OR(operand1, operand2) {
        this.C = operand1 | operand2;
    }

    NOR(operand1, operand2) {
        this.C = ~(operand1 | operand2) & 0xFF;
    }

    SUM(operand1, operand2, carry_in) {
        let result = operand1 + operand2 + carry_in;
        this.C = result & 0xFF;
    }

    SUB(operand1, operand2, carry_in) {
        let result = operand1 - operand2 - carry_in;
        this.C = result & 0xFF;
    }

    MUL(operand1, operand2, carry_in) {
        let result = (operand1 * operand2) + carry_in;
        this.C = result & 0xFF;
    }

    DIV(operand1, operand2, carry_in) {
        if (operand2 === 0) {
            alert("Division by zero error!");
            this.C = 0;
        } else {
            let result = Math.floor(operand1 / operand2) + carry_in;
            this.C = result & 0xFF;
        }
    }

    setMaxValue(maxValue) {
        this.A = maxValue;
        this.B = maxValue;
        this.C = maxValue;
    }

    execute(code) {
        const instance = new Executive();
        instance.setMaxValue(1000000000);
        console.log(`Executing Operand Code: ${code}`);
        let keyword = "PRINT ";
        let pos = code.indexOf(keyword);
        if (pos !== -1) {
            let toPrint = code.substring(pos + keyword.length);
            console.log(toPrint);
            document.getElementById('output').innerText += toPrint + '\n';
        } else if (code === "BUFFER A") {
            this.C = this.A;
        } else if (code === "BUFFER B") {
            this.C = this.B;
        } else if (code === "BUFFER RAM[A]") {
            this.C = this._ram[this.A];
        } else if (code === "BUFFER RAM[B]") {
            this.C = this._ram[this.B];
        } else if (code === "DEFINE A") {
            let a_input = parseInt(document.getElementById('aInput').value);
            this.A = a_input & 0xFF;
        } else if (code === "DEFINE B") {
            let b_input = parseInt(document.getElementById('bInput').value);
            this.B = b_input & 0xFF;
        } else if (code === "AND A,B") {
            this.AND(this.A, this.B);
        } else if (code === "OR A,B") {
            this.OR(this.A, this.B);
        } else if (code === "NAND A,B") {
            this.NAND(this.A, this.B);
        } else if (code === "NOR A,B") {
            this.NOR(this.A, this.B);
        } else if (code === "SUM A+B C=1") {
            this.SUM(this.A, this.B, 1);
        } else if (code === "SUM A+B C=0") {
            this.SUM(this.A, this.B, 0);
        } else if (code === "SUB A-B C=1") {
            this.SUB(this.A, this.B, 1);
        } else if (code === "SUB A-B C=0") {
            this.SUB(this.A, this.B, 0);
        } else if (code === "MUL A*B C=1") {
            this.MUL(this.A, this.B, 1);
        } else if (code === "MUL A*B C=0") {
            this.MUL(this.A, this.B, 0);
        } else if (code === "DIV A/B C=1") {
            this.DIV(this.A, this.B, 1);
        } else if (code === "DIV A/B C=0") {
            this.DIV(this.A, this.B, 0);
        } else if (code === "C->RAM[A]") {
            this._ram[this.A] = this.C;
        } else if (code === "C->RAM[B]") {
            this._ram[this.B] = this.C;
        } else if (code === "RAM[A]->A") {
            this.A = this._ram[this.A];
        } else if (code === "RAM[B]->B") {
            this.B = this._ram[this.B];
        } else if (code === "RAM[A]->B") {
            this.B = this._ram[this.A];
        } else if (code === "RAM[B]->A") {
            this.A = this._ram[this.B];
        } else if (code === "IF(A=B)") {
            this.C = (this.A === this.B) ? 0 : 1;
        } else if (code === "CHECK(C=0)") {
            if (this.C === 0) {
                console.log("TRUE");
                document.getElementById('output').innerText += "TRUE\n";
            } else {
                console.log("FALSE, C = 1");
                document.getElementById('output').innerText += "FALSE, C = 1\n";
            }
        } else {
            console.error(`Unknown Command: ${code}`);
            document.getElementById('output').innerText += `Unknown Command: ${code}\n`;
        }
        console.log(`Result: ${this.C}`);
        document.getElementById('output').innerText += `Executing Operand Code: ${code}\nResult: ${this.C}\n`;
    }
}

const exe = new Executive();

function executeFromInput() {
    const codeLines = document.getElementById('codeInput').value.split('\n');
    for (const code of codeLines) {
        exe.execute(code.trim());
    }
}

function executeFromFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const lines = e.target.result.split('\n');
            for (const line of lines) {
                exe.execute(line.trim());
            }
        };
        reader.readAsText(fileInput);
    } else {
        alert("No file selected");
    }
}
