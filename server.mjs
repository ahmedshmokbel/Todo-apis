import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 50003;
const DBConnectionStr = 'mongodb+srv://ahmedmokbel:l7uRbJ2eBvgJCZvv@cluster0.yr8cy.mongodb.net/TestDB?retryWrites=true&w=majority&appName=Cluster0'
// Middleware
app.use(bodyParser.json());


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





async function getDataFromCollection(collectionName, filter, isResultArray) {
  try {
    const client = new MongoClient(DBConnectionStr);
    await client.connect();

    const database = client.db();
    let params;
    if (!isResultArray) {
      params = await database.collection(collectionName).findOne(filter);
    } else {
      // console.log(await database.collection(collectionName).find(filter));
      params = await database.collection(collectionName).find(filter).toArray();
    }
    console.log(params);
    return params;
  } catch (error) {
    console.error("Error:", error);
    //   res.status(500).json({ error: "Internal Server Error" });
  }

}

app.get("/todos", async (req, res) => {
  const results = await getDataFromCollection("todosList", {}, true);
  res.json(results);
});



app.post("/todos", async (req, res) => {
  const todo = req.body;  // Your todo object from the request body


  const client = new MongoClient(DBConnectionStr);
  try {

    await client.connect();
    const database = client.db();
    const result = await database.collection("todosList").insertOne(todo);
    console.log('ffff', result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});


app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(DBConnectionStr);
  console.log('ID Delete', id);
  try {
    await client.connect();
    const database = client.db();
    const result = await database.collection("todosList")
      .deleteOne({ _id: new ObjectId(id) });
      console.log('Result Delete', result);

    if (result.deletedCount === 1) {
      res.status(204).send();  // No content to send back
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;  // Updates to the todo item

  // Remove the _id field from updates if it exists
  delete updates._id;

  const client = new MongoClient(DBConnectionStr);
  try {
    await client.connect();
    const database = client.db();
    const result = await database.collection("todosList").updateOne(
      { _id: new ObjectId(id) }, // Ensure correct conversion to ObjectId
      { $set: updates }          // Apply updates without _id
    );

    if (result.matchedCount === 1) {
      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Todo updated successfully" });
      } else {
        res.status(200).json({ message: "No changes made to the todo" });
      }
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
});
