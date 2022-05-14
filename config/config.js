// mongo name comes from the running services on mongo in docker-compose file
module.exports = {
    MONGO_IP:process.env.MONGO_IP  || "mongo",
    MONGO_PORT:process.env.MONGO_PORT || 27017,
    MONGO_USER:process.env.MONGO_USER,
    MONGO_PASSWORD:process.env.MONGO_PASSWORD  
}