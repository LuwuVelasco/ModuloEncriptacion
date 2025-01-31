function encrypt(method) {
    const text = document.getElementById("textInput").value;
    if (!text || typeof text !== "string") {
        Swal.fire("Error", "Debe ingresar un texto válido", "error");
        return;
    }

    let result = "";
    switch (method) {
        case "polibio":
            result = polibioCipher(text);
            animatePolibioEncryption(text);
            break;
        case "cesar":
            result = cesarCipher(text, 3);
            animateCesarEncryption(text, 3);
            break;
        case "alberti":
            result = albertiCipher(text);
            createAlbertiWheel();
            break;
        default:
            result = "Método no encontrado";
    }
}

function showInfo(method) {
    let title = "";
    let message = "";
    let image = "";
    switch (method) {
        case "polibio":
            title = "Cifrado de Polibio";
            message = "El cifrado de Polibio es un método de sustitución que usa una matriz de 5x5 para representar letras con pares de números. El código de las letras es la fila y la tabla en la que se encuentran.";
            break;
        case "cesar":
            title = "Código César";
            message = "El código César es un cifrado por desplazamiento donde cada letra del alfabeto se reemplaza por otra desplazada un número fijo de posiciones.";
            break;
        case "alberti":
            title = "Disco de Alberti";
            message = "El disco de Alberti es un cifrado polialfabético en el que se usa un disco rotatorio con múltiples alfabetos para cifrar un mensaje.";
            break;
        case "enigma":
            title = "Máquina Enigma";
            message = "La Máquina Enigma fue utilizada en la Segunda Guerra Mundial por Alemania para cifrar mensajes militares. Funcionaba con rotores intercambiables que generaban un cifrado complejo y variable en cada pulsación.";
            image = "enigma_machine.jpg";
            break;
        case "escitala":
            title = "Escítala Espartana";
            message = "La escítala espartana es un método de cifrado que se usaba en la antigua Grecia. Consistía en un mensaje escrito en una tira de cuero enrollada alrededor de un cilindro. Solo un cilindro del mismo diámetro podía descifrarlo correctamente.";
            image = "escitala_spartan.png";
            break;
        default:
            title = "Información no encontrada";
            message = "No hay información disponible sobre este método.";
    }
    
    Swal.fire({ 
        title: title, 
        html: `<p>${message}</p>${image ? `<img src='${image}' alt='${title}' class='img-fluid mt-3' style='border-radius: 10px;'>` : ''}`,
        icon: "info" 
    });
}

function polibioCipher(text) {
    const polybiusSquare = {
        'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
        'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
        'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
        'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45', 'V': '45',
        'W': '51', 'X': '52', 'Y': '53', 'Z': '54'
    };
    return text.toUpperCase().split('').map(char => polybiusSquare[char] || char).join(' ');
}

function generatePolibioTable(text) {
    const polybiusSquare = {
        'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
        'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
        'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
        'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45', 'V': '45',
        'W': '51', 'X': '52', 'Y': '53', 'Z': '54'
    };
    
    const headers = [" ", "1", "2", "3", "4", "5"];
    const rows = [
        ["1", "A", "B", "C", "D", "E"],
        ["2", "F", "G", "H", "I/J", "K"],
        ["3", "L", "M", "N", "O", "P"],
        ["4", "Q", "R", "S", "T", "U/V"],
        ["5", "W", "X", "Y", "Z", " "]
    ];
    
    let table = d3.create("table").attr("border", 1).style("width", "100%").style("text-align", "center").style("margin", "10px");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    
    let headerRow = thead.append("tr");
    headers.forEach(header => {
        headerRow.append("th").text(header);
    });
    
    rows.forEach(row => {
        let tr = tbody.append("tr");
        row.forEach((cell, index) => {
            let cellValue = cell.includes("/") ? (cell === "I/J" ? "24" : "45") : polybiusSquare[cell] || "";
            let td = tr.append(index === 0 ? "th" : "td").text(cell).attr("id", cellValue ? `cell-${cellValue}` : "");
        });
    });
    
    return table.node().outerHTML;
}

function animatePolibioEncryption(text) {
    const polybiusSquare = {
        'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
        'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
        'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
        'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45', 'V': '45',
        'W': '51', 'X': '52', 'Y': '53', 'Z': '54'
    };
    
    Swal.fire({
        title: "Cifrado de Polibio",
        html: `<p>Texto Original: ${text}</p><p>Encriptado: <span id='anim-text'></span></p><div id='polibio-table'></div><p id='polibio-match'></p>`
    });

    let encodedText = text.toUpperCase().split('').map(char => polybiusSquare[char] || char);
    let index = 0;
    function animate() {
        d3.selectAll("td").transition().duration(500).style("background", ""); // Despinta todas las celdas antes de marcar la siguiente
        
        if (index < encodedText.length) {
            let char = text[index].toUpperCase();
            let encodedChar = polybiusSquare[char] || char;
            
            if (!polybiusSquare[char]) {
                document.getElementById('anim-text').innerText += char + ' ';
            } else {
                document.getElementById('anim-text').innerText += encodedChar + ' ';
                document.getElementById('polibio-match').innerText = `Letra: ${char} → Código: ${encodedChar}`;
                let cell = d3.select(`#cell-${encodedChar}`);
                if (!cell.empty()) {
                    cell.transition().delay(300).duration(1000).style("background", "rgb(71,235,180)");
                }
            }
            index++;
            setTimeout(animate, 1400); // Aumenta el tiempo para evitar superposiciones
        }
    }
    setTimeout(() => {
        d3.select("#polibio-table").html(generatePolibioTable(text));
        setTimeout(animate, 1000); // Asegura que la limpieza ocurra antes de iniciar
    }, 1000);
}

function cesarCipher(text, shift) {
    return text.split('').map(char => {
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

function animateCesarEncryption(text) {
    Swal.fire({
        title: "Cifrado César",
        html: `<p>Ingrese el desplazamiento: <input id='cesar-shift' type='number' min='1' max='26' class="form-control" value='3' ></p>
               <button onclick='startCesarEncryption("${text}")' type="button" class="btn btn-success" style="margin-bottom: 10px;">Iniciar</button>
               <p>Texto Original: ${text}</p><p>Encriptado: <span id='anim-text'></span></p>
               <div id='cesar-table'></div><p id='cesar-match'></p>`
    });
}

function startCesarEncryption(text) {
    let shift = parseInt(document.getElementById("cesar-shift").value);

    // Validación del shift
    if (isNaN(shift) || shift < 1 || shift > 26) {
        Swal.fire("Error", "Por favor, ingrese un desplazamiento válido entre 1 y 25.", "error");
        return;
    }

    let encodedText = cesarCipher(text, shift);
    d3.select("#cesar-table").html(generateCesarVisualization(shift));
    let index = 0;

    function animate() {
        // Limpiar todas las celdas antes de resaltar
        d3.selectAll("td, th").transition().duration(100).style("background", "");

        if (index < text.length) {
            let char = text[index].toUpperCase();
            let encodedChar = cesarCipher(char, shift);

            if (!/[A-Z]/.test(char)) {
                document.getElementById('anim-text').innerText += char;
            } else {
                document.getElementById('anim-text').innerText += encodedChar;
                document.getElementById('cesar-match').innerText = `Letra: ${char} → Código: ${encodedChar}`;

                let originalCell = d3.select(`#cesar-char-${char}`);
                let shiftedCell = d3.select(`#cesar-shifted-${encodedChar}`);

                if (!originalCell.empty()) {
                    originalCell.transition().duration(500).style("background", "rgb(71,235,180)");
                }
                if (!shiftedCell.empty()) {
                    shiftedCell.transition().duration(500).style("background", "rgb(144, 211, 189)");
                }
            }
            index++;
            setTimeout(animate, 1200);
        }
    }
    animate();
}

function generateCesarVisualization(shift) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);

    let table = d3.create("table").attr("border", 1).style("width", "100%").style("text-align", "center").style("margin", "10px");
    let thead = table.append("thead");
    let tbody = table.append("tbody");

    let headerRow = thead.append("tr");
    alphabet.split("").forEach(letter => {
        headerRow.append("th").text(letter).attr("id", `cesar-char-${letter}`);
    });

    let row = tbody.append("tr");
    shiftedAlphabet.split("").forEach(letter => {
        row.append("td").text(letter).attr("id", `cesar-shifted-${letter}`);
    });

    return table.node().outerHTML;
}

function createAlbertiWheel() {
    let text = document.getElementById("textInput").value;
    if (!text) {
        Swal.fire("Error", "Debe ingresar un texto válido", "error");
        return;
    }
    Swal.fire({
        title: "Disco de Alberti",
        html: `<p>Texto Original: <span id='original-text'>${text}</span></p>
               <p>Encriptado: <span id='alberti-match'></span></p>
               <canvas id='albertiCanvas' width='330' height='330' style='border: 2px solid black;'></canvas>
               <br>
               <button onclick='rotateAlbertiWheel()' class='btn btn-primary'>Girar Ruleta</button>
               <button onclick='startAlbertiEncryption()' class='btn btn-success'>Iniciar</button>`
    });
    drawAlbertiWheel();
}

let rotationSteps = 0;
const normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const albertiAlphabet = "PONMLKJZYXWVUTSRQIHGFEDCBA";

function drawAlbertiWheel() {
    let canvas = document.getElementById("albertiCanvas");
    if (!canvas) return;
    let ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let outerRadius = 130;
    let innerRadius = 90;
    let angleStep = (2 * Math.PI) / 26;
    
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Dibuja el círculo exterior (alfabeto normal)
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(184, 233, 217)";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    for (let i = 0; i < 26; i++) {
        let angle = i * angleStep;
        let x = centerX + Math.cos(angle) * (outerRadius - 15);
        let y = centerY + Math.sin(angle) * (outerRadius - 15);
        ctx.fillStyle = "black";
        ctx.fillText(normalAlphabet[i], x, y);

        
    }
    
    // Dibuja el círculo interior (alfabeto cifrado)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(109, 160, 143)";
    ctx.fill();
    ctx.stroke();
    
    for (let i = 0; i < 26; i++) {
        let rotatedIndex = (i + rotationSteps) % 26;
        let angle = i * angleStep;
        let x = centerX + Math.cos(angle) * (innerRadius - 15);
        let y = centerY + Math.sin(angle) * (innerRadius - 15);
        ctx.fillStyle = "black";
        ctx.fillText(albertiAlphabet[rotatedIndex], x, y);
    }

    // Dibuja líneas divisorias entre las letras
    for (let i = 0; i < 26; i++) {
        let angle = i * angleStep;
        let startX1 = centerX;
        let startY1 = centerY;
        let endX1 = centerX + Math.cos(angle - angleStep / 2) * (innerRadius);
        let endY1 = centerY + Math.sin(angle - angleStep / 2) * (innerRadius);
        let startX2 = centerX + Math.cos(angle - angleStep / 2) * (innerRadius);
        let startY2 = centerY + Math.sin(angle - angleStep / 2) * (innerRadius);
        let endX2 = centerX + Math.cos(angle - angleStep / 2) * (outerRadius);
        let endY2 = centerY + Math.sin(angle - angleStep / 2) * (outerRadius);
        
        ctx.beginPath();
        ctx.moveTo(startX1, startY1);
        ctx.lineTo(endX1, endY1);
        ctx.moveTo(startX2, startY2);
        ctx.lineTo(endX2, endY2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(59, 88, 79)";
    ctx.fill();
    ctx.stroke();
}

function rotateAlbertiWheel() {
    rotationSteps = (rotationSteps + 1) % 26;
    drawAlbertiWheel();
}

function albertiCipher(text) {
    let mapping = {};
    for (let i = 0; i < 26; i++) {
        let rotatedIndex = (i + rotationSteps) % 26;
        mapping[normalAlphabet[i]] = albertiAlphabet[rotatedIndex];
    }
    return text.toUpperCase().split('').map(char => mapping[char] || char).join('');
}

function startAlbertiEncryption() {
    let text = document.getElementById("textInput").value.toUpperCase();
    if (!text) {
        Swal.fire("Error", "Debe ingresar un texto válido", "error");
        return;
    }
    let encodedText = albertiCipher(text);
    
    let index = 0;
    function animate() {
        if (index < text.length) {
            let char = text[index].toUpperCase();
            let encodedChar = albertiCipher(char);
            
            if (!/[A-Z]/.test(char)) {
                document.getElementById('alberti-match').innerText += char;
            } else {
                document.getElementById('alberti-match').innerText += encodedChar;
            }
            index++;
            setTimeout(animate, 500);
        }
    }
    document.getElementById('alberti-match').innerText = "";
    animate();
}
