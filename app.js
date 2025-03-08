const fs = require('fs');
const net = require('net');

const filePath = 'D:\\test.txt';  // Change to your file path
const templatePath = 'testhtml';  // Change to your file path
const SERVER_HOST = '127.0.0.1';  // Change to your server IP if needed
const SERVER_PORT = 5250;         // Make sure this matches your server port

// Create a TCP client and connect to the server
const client = new net.Socket();
client.connect(SERVER_PORT, SERVER_HOST, () => {
    console.log('Connected to server, sending initial message...');


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return;
        }

        let xml = '';
             xml += `<componentData id=\\"${'ccgf0'}\\"><data id=\\"text\\" value=\\"${data}\\" /></componentData>`
              xml = `"<templateData>${xml}</templateData>"`

        // Send file content over TCP
        // client.write(`cg 1-2 update 2 ${xml}\r\n`);
    client.write(`cg 1-2 add 2 "${templatePath}" 1 ${xml} \r\n`);

    });

});

// Handle TCP errors
client.on('error', (err) => {
    console.error('TCP Connection Error:', err.message);
});

// Watch for file changes
fs.watch(filePath, (eventType, filename) => {
    if (filename) {
        // Read the content of the file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err.message);
                return;
            }

            let xml = '';
                 xml += `<componentData id=\\"${'ccgf0'}\\"><data id=\\"text\\" value=\\"${data}\\" /></componentData>`
                  xml = `"<templateData>${xml}</templateData>"`

            // Send file content over TCP
            client.write(`cg 1-2 update 2 ${xml}\r\n`);
        });
    }
});

console.log(`Watching for changes in: ${filePath}`);
