require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser")
const mongoose  = require("mongoose")
// const [ default: mongoose] = require("mongoose")

const test = express();
test.use(bodyParser.json())

const port = 5000;


 

// let data = [
//     {    
//         name: "samuel",
//         number: 45,
//     },

//     {    
//         name: "diligent", 
//         age: 20,
//     }
// ];

// Define a Student schema
const contactSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    age: Number,

  });
  
  // Create a Student model
  const Contact = mongoose.model("Contact", contactSchema);

  test.get("/contacts", async function (req, res) {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  test.get("/contact/:id", async function (req, res) {
    try {
      const contact = await Contact.findById(req.params.id);
      
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: "Contacts not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  test.get("/contacts/age-gt-18", async function (req, res) {
    try {
      const contacts = await Contact.find({ age: { $gt: 18 } });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  test.get("/contacts/age-name", async function (req, res) {
    try {
      const contacts = await Contact.find({ 
        age: { $gt: 18 },
        FirstName: { $regex: "ah", $options: "i" } // Case-insensitive search for "ah" in the first name
      });
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  test.delete("/contacts/delete-under-5", async function (req, res) {
    try {
      const result = await Contact.deleteMany({ age: { $lt: 5 } });
      res.json({ message: `${result.deletedCount} contacts deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
  


  test.post("/contact", async function (req, res) {
    try {
      const newContact = await Contact.create(req.body);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  test.patch("/contact/:id", async function (req, res) {
    try {
      const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      if (updatedContact) {
        res.json(updatedContact);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  test.delete("/contact/:id", async function (req, res) {
    try {
      const deletedContact = await Contact.findByIdAndDelete(req.params.id);
      
      if (deletedContact) {
        res.json({ message: "Contact deleted successfully" });
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// mongoose.connect("mongodb+srv://<username>:<password>@cluster0.co2ono6.mongodb.net/?retryWrites-true&w-majority",{
// usedNewurlparser:true,
// useUnifiedTopology: true
// })
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//     console.log('connected to MongoDB')
// })


mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection 
db.on("error", (error)=>console.error(error))
db.once("open",()=>console.log("connected to database"))


// test.get("/students", function (req, res) {
//     res.json(data);
// });


// test.get("/student/:id", function(req, res){
    // console.log(typeof req.params.id)
    // const studentId = parseInt(req.params.id) // parseInt help in converting a string to an integer
    // const student = data.find(student => student.id === studentId)

    // if(student){
    //     console.log(student)
    // } else {
    //     console.log("student does not exit. Try again")
    // }

    // if(student){
    //     res.json(student)
    // } else {
    //     res.status(404).json({error: "student does not exist. Try again"})
    // }
    
// })

//when adding a new student to the server
// test.post("/student/:id", function(req,res){
//     const newStudent = req.body;
//     newStudent.id = data.length + 1
//     data.push(newStudent)
//     res.status(201).json(newStudent);
// })

// test.patch("/student/:id", function(req, res, ){
//     const studentId = parseInt(req.params.id);
//     const studentIndex = data.findIndex(student => student.id === studentId);

//     if(studentIndex !== -1){
//         data[studentIndex] = {
//             ...data[studentIndex],
//             ...req.body
//         }
//         res.json(data[studentIndex]);
//     } else {
//         res.status(401).json({error: "student not found"})
//     }
// })








test.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
