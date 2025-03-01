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
            animateAlbertiEncryption(text);
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
            message = "El cifrado de Polibio es un método de sustitución que usa una matriz de 5x5 para representar letras con pares de números.";
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
    
    let table = d3.create("table").attr("border", 1).style("width", "100%" ).style("text-align", "center");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    
    let headerRow = thead.append("tr");
    headers.forEach(header => {
        headerRow.append("th").text(header);
    });
    
    rows.forEach(row => {
        let tr = tbody.append("tr");
        row.forEach((cell, index) => {
            let cellValue = cell.includes("/") ? "24" : polybiusSquare[cell] || "";
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
        d3.selectAll("td").style("background", "");
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
                    cell.transition().duration(1000).style("background", "yellow");
                }
            }
            index++;
            setTimeout(animate, 1000);
        }
    }
    setTimeout(() => {
        d3.select("#polibio-table").html(generatePolibioTable(text));
        animate();
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
        html: `<p>Ingrese el desplazamiento: <input id='cesar-shift' type='number' min='1' max='25' value='3'></p>
               <button onclick='startCesarEncryption("${text}")'>Iniciar</button>
               <p>Texto Original: ${text}</p><p>Encriptado: <span id='anim-text'></span></p><div id='cesar-table'></div><p id='cesar-match'></p>`
    });
}

function startCesarEncryption(text) {
    let shift = parseInt(document.getElementById("cesar-shift").value);
    let encodedText = cesarCipher(text, shift);
    d3.select("#cesar-table").html(generateCesarVisualization(text, shift));
    let index = 0;
    function animate() {
        d3.selectAll("td").style("background", "");
        if (index < encodedText.length) {
            let char = text[index].toUpperCase();
            let encodedChar = cesarCipher(char, shift);
            if (!/[A-Z]/.test(char)) {
                document.getElementById('anim-text').innerText += char;
            } else {
                document.getElementById('anim-text').innerText += encodedChar;
                document.getElementById('cesar-match').innerText = `Letra: ${char} → Código: ${encodedChar}`;
                let cell = d3.select(`#cesar-char-${char}`);
                if (!cell.empty()) {
                    cell.transition().duration(1000).style("background", "yellow");
                }
            }
            index++;
            setTimeout(animate, 1000);
        }
    }
    animate();
}

function generateCesarVisualization(text, shift) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);
    
    let table = d3.create("table").attr("border", 1).style("width", "100%").style("text-align", "center");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    
    let headerRow = thead.append("tr");
    alphabet.split("").forEach(letter => {
        headerRow.append("th").text(letter).attr("id", `cesar-char-${letter}`);
    });
    
    let row = tbody.append("tr");
    shiftedAlphabet.split("").forEach(letter => {
        row.append("td").text(letter);
    });
    
    return table.node().outerHTML;
}

function albertiCipher(text) {
    const disk = "PONMLKJZYXWVUTSRQIHGFEDCBA";
    return text.toUpperCase().split('').map(char => {
        let index = char.charCodeAt(0) - 65;
        return (index >= 0 && index < 26) ? disk[index] : char;
    }).join('');
}

function animateAlbertiEncryption(text) {
    Swal.fire({
        title: "Cifrado de Alberti",
        html: `<p>Texto Original: ${text}</p><p>Encriptado: <span id='anim-text'></span></p><div id='alberti-table'></div><p id='alberti-match'></p>`
    });
    
    let encodedText = albertiCipher(text);
    d3.select("#alberti-table").html(generateAlbertiVisualization());
    let index = 0;
    function animate() {
        d3.selectAll("td").style("background", "");
        if (index < encodedText.length) {
            let char = text[index].toUpperCase();
            let encodedChar = albertiCipher(char);
            if (!/[A-Z]/.test(char)) {
                document.getElementById('anim-text').innerText += char;
            } else {
                document.getElementById('anim-text').innerText += encodedChar;
                document.getElementById('alberti-match').innerText = `Letra: ${char} → Código: ${encodedChar}`;
                let cell = d3.select(`#alberti-char-${char}`);
                if (!cell.empty()) {
                    cell.transition().duration(1000).style("background", "yellow");
                }
            }
            index++;
            setTimeout(animate, 1000);
        }
    }
    animate();
}

function generateAlbertiVisualization() {
    let normalAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let albertiAlphabet = "PONMLKJZYXWVUTSRQIHGFEDCBA";
    let table = d3.create("table").attr("border", 1).style("width", "100%").style("text-align", "center");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    
    let headerRow = thead.append("tr");
    normalAlphabet.split("").forEach(letter => {
        headerRow.append("th").text(letter);
    });
    
    let row = tbody.append("tr");
    albertiAlphabet.split("").forEach(letter => {
        row.append("td").text(letter);
    });
    
    return table.node().outerHTML;
}

