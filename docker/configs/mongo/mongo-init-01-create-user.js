var db = connect("mongodb://admin:admin@localhost:27017/admin");

db = db.getSiblingDB("cep_api");

db.createUser({
  user: "api_user",
  pwd: "api_pass",
  roles: [
    {
      role: "readWrite",
      db: "cep_api",
    },
  ],
});
