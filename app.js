import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";


dotenv.config();
const app = express()
const port = process.env.PORT || 3000

app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

app.get('/', (req, res) => {
    res.json({
        "response": "Hello There",
        "response2": "This is a nice response"
    })
})

app.get('/comments', async (req, res) => {

    const querySnapshot = await getDocs(collection(db, "comments"));
    let comments = []

    querySnapshot.forEach((doc) => {
        comments.push(doc.data())
    });

    if (querySnapshot) {
        res.send(comments)
    } else {
        res.send("No comments found")
    }

})

app.post('/comments', async (req, res) => {
    const { name, text } = req.body
    const data = {
        name,
        text
    }
    try {
        const docRef = await addDoc(collection(db, "comments"), {
          name: data.name,
          text: data.text
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    res.send('Comment Added')
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})