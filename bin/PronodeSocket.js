/*
 * Pronode Communication Layer 
 */

var PronodeSocket = function(socket){
    var self = this;

    self.socket = socket;
    self._buffer = [];
    self.processingPacket = false;

    // When data incoming
    socket.on('data', function(data){
        self._buffer.push(data);
        self.emit('_data-buffered', self._buffer.indexOf(data));
    });

    self.on('_data-buffered', function(){
        self._checkBuffer();
    });

    // When a packet is ready to be parsed
    self.on('_packet', function(packet){
        try{
            var parsed = JSON.parse(packet);
            if(typeof parsed.evt !== 'string')
                throw new TypeError();
        } catch(err){
            self.emit('_invalid_packet', err, packet);
            return;
        }

        self.emit('request', parsed.evt, parsed.data);
    });

    // Timeout
    socket.on('timeout', function(){
        throw new Error('Connection to Pronode Server timeout...'); 
    });

    // Error
    socket.on('error', function(err){
        logger.error(err);
    });

    self.on('error', function(err){
        console.err(err);
    });

    // End socket
    socket.on('end', function(){
        self.end();    
    });
};

PronodeSocket.prototype = require('events').EventEmitter.prototype;

PronodeSocket.prototype._checkBuffer = function(){
    if(this.processingPacket || !this._buffer[0])
        return;

    var self = this;
    self.processingPacket = true;

    var size = self._buffer[0].readUInt16BE(0),
        remaining = size,
        written = 0,
        packet = new Buffer(size);
    
    // Remove 2 first byte which represent the size of the packet
    self._buffer[0] = self._buffer[0].slice(2);

    // Process buffer
    var processNextBuffer = function(){
        var buf = self._buffer[0];

        // Check if the current buffer can be totally processed
        if(remaining - buf.length >= 0){
            buf.copy(packet, written);
            written += buf.length;
            remaining -= buf.length;
            self._buffer.shift();
        } else {
            self._buffer[0] = buf.slice(remaining);
            buf.copy(packet, written);
            written += remaining;
            remaining -= remaining;
        }

        if(remaining === 0){
            self.emit('_packet', packet);
            self.processingPacket = false;
            return true;
        }

        return false;
    };

    // Write packet with data in buffer
    for(var i = 0; i < self._buffer.length; i++){
        if(processNextBuffer()){
            return;
        }
    }

    // If the packet isn't complete, wait for new data incoming
    self.on('_data-buffered', function(){
        processNextBuffer();
    });
    self.once('_packet', function(){
        self.removeListener('_data-buffered', processNextBuffer);
    });
};

// Send data following the Pronode Communication Protocol
PronodeSocket.prototype.send = function(event, data){
    var content = new Buffer(JSON.stringify({
        evt: event,
        data: arguments[1]
    }));

    var payload = new Buffer(content.length + 2);
    payload.writeUInt16BE(content.length, 0);
    content.copy(payload, 2);

    this.socket.write(payload);
};

// End the socket
PronodeSocket.prototype.end = function(event, data){
    if(arguments[0]){
        this.send(event, arguments[1]);
    }

    var tryEnd = function(){
        if(this._buffer.length > 0){
            this._checkBuffer();
            return false;
        }

        try{
            this.socket.end();
            this.removeAllListeners();
            this.socket.removeAllListeners();

            return true;
        } catch(e){
            throw new Error(e);
        }
    }.bind(this);

    if(!tryEnd()){
        this.on('_packet_error', tryEnd);
        this.on('request', tryEnd);
    }
};

module.exports = PronodeSocket;
