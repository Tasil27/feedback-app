import express from "express";

const app = express();
const port = 3000;

app.use(express.json());


app.post('/feedback', (req, res) =>{
    const { title, text } = req.body;
    
});

app.get('/feedback', (req, res) =>{

});


app.delete('/feedback', (req, res) =>{

});

app.listen(port, () => {
    console.log(`Server is running on http://loclahost: ${port}`);
});