import express from "express";
import bcrypt from "bcrypt"
const app = express();
import bodyParser from "body-parser"
import {MongoClient, ServerApiVersion} from 'mongodb';
import cors from "cors";
const uri = "mongodb+srv://lat1404:49Brading@ptcluster.9ktwtrt.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

app.use(express.json());


app.post('/newAccount',async (req, res) => {
    let salt = "";
    let hashPass = "";
    const {fullname, username, email, dob, password, selectedExperience, selectedDiscipline} = req.body;
    bcrypt.genSalt(10).then(newSalt => {
      salt = newSalt;
      console.log(salt);
      return bcrypt.hash(password, salt)
    }).then(newHashPass => {
      hashPass = newHashPass;
    });
    console.log(hashPass);
    
    
    await client.connect();
    const db = client.db("TrainingAppDB");
    await db.collection("Users").insertOne({"fullname": fullname, "username": username, "salt": salt, "email": email, "dob": dob, "password": hashPass})

    
});

app.listen(8000, () => {
    console.log("server listening on 8000")
});