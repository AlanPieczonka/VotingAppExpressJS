export default req => req.header('x-forwarder-for') || req.connection.remoteAddress;
