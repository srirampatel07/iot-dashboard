const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

// BIN STORAGE
let bins = {
A:{id:"A",name:"Dustbin A",weight:0,level:100,fullBy:"none",updatedAt:null},
B:{id:"B",name:"Dustbin B",weight:0,level:100,fullBy:"none",updatedAt:null},
C:{id:"C",name:"Dustbin C",weight:0,level:100,fullBy:"none",updatedAt:null},
D:{id:"D",name:"Dustbin D",weight:0,level:100,fullBy:"none",updatedAt:null},
};

// SOCKET CONNECTION
io.on("connection",(socket)=>{
console.log("Dashboard connected");
socket.emit("binsUpdate",Object.values(bins));
});

// GET ALL BINS
app.get("/api/bins",(req,res)=>{
res.json(Object.values(bins));
});

// UPDATE BIN
app.post("/api/update-bin",(req,res)=>{

const {binId,weight,level,fullBy}=req.body;
const id=(binId||"").toUpperCase();

if(!bins[id]){
return res.status(400).json({error:"Invalid BIN ID"});
}

if(typeof weight==="number") bins[id].weight=weight;
if(typeof level==="number") bins[id].level=level;
if(typeof fullBy==="string") bins[id].fullBy=fullBy;

bins[id].updatedAt=new Date().toISOString();

// REAL TIME UPDATE
io.emit("binsUpdate",Object.values(bins));

res.json({status:"ok",bin:bins[id]});
});

server.listen(PORT,()=>{
console.log("Server running on port "+PORT);
});