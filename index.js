const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sajc8ea.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		const postCollection = client.db("my-media").collection("posts");
		const usersCollection = client.db("my-media").collection("users");
		const commentsCollection = client.db("my-media").collection("comments");

		app.post("/post", async (req, res) => {
			const product = req.body;
			const result = await postCollection.insertOne(product);
			res.send({ ...result, ...req.body });
		});

		//    app.put("/post/:id", async (req, res) => {
		// 				const id = req.params.id;
		// 				const data = req.body.comment;
		// 				const filter = { _id: ObjectId(id) };
		// 				const allComment = await postCollection.find(filter).toArray();
		//        var myComment = allComment[0].comment;
		//        const arrayComment = [...myComment]
		//        const newArray = [...arrayComment, data]

		// 				const options = { upsert: true };
		// 				const updateDoc = [
		// 					{
		// 						$set: { comment: {newArray} },
		// 					},
		// 				];
		// 				const result = await postCollection.updateOne(
		// 					filter,
		// 					updateDoc,
		// 					options
		// 				);
		// 				res.send(result);

		//    });

		app.get("/post", async (req, res) => {
			const query = {};
			const result = await postCollection.find(query).toArray();
			res.send(result);
		});
		app.post("/users", async (req, res) => {
			const product = req.body;
			const result = await usersCollection.insertOne(product);
			res.send({ ...result, ...req.body });
		});

		app.post("/comment", async (req, res) => {
			const comments = req.body;
			const result = await commentsCollection.insertOne(comments);
			res.send({ ...result, ...req.body });
        });
        

        

		app.get("/allComments/:email", async (req, res) => {
			const email = req.params.email;
			const query = { userEmail: email };
			const comments = await commentsCollection.find(query).toArray();
			res.send(comments);
           
        });
        




	} finally {
	}
}
run().catch(console.log);

app.get("/", async (req, res) => {
	res.send("my media server is running");
});

app.listen(port, () => console.log(`My media server running on ${port}`));
