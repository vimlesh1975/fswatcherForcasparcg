const fs = require('fs');
const net = require('net');

const filePath = 'D:\\test.txt'; 
const templatePath = 'testhtml';  
const SERVER_HOST = '127.0.0.1'; 
const SERVER_PORT = 5250;        

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
        client.write(`cg 1-2 add 2 "${templatePath}" 1 ${xml} \r\n`);
    });
});
client.on('error', (err) => {
    console.error('TCP Connection Error:', err.message);
});

fs.watch(filePath, (eventType, filename) => {
    if (filename) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err.message);
                return;
            }
            let xml = '';
            xml += `<componentData id=\\"${'ccgf0'}\\"><data id=\\"text\\" value=\\"${data}\\" /></componentData>`
            xml = `"<templateData>${xml}</templateData>"`
            client.write(`cg 1-2 update 2 ${xml}\r\n`);
        });
    }
});

console.log(`Watching for changes in: ${filePath}`);
