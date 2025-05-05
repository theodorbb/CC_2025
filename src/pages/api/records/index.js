import { sendMethodNotAllowed, sendOk } from "../../../../utils/apiMethods";
import { COLLENTION_NAME } from "../../../../utils/constants";
import { getCollection } from "../../../../utils/functions";

const getRecords = async () => {
    const collection = await getCollection(COLLENTION_NAME);
    return await collection.find({}).toArray();
}

const createRecord = async (data) => {
    const collection = await getCollection(COLLENTION_NAME);
    return await collection.insertOne(data);
}

export default async function handler(req, res) {
    const { method, body } = req;

    try {
        let result = null;

        switch(method) {
            case "GET": 
                result = await getRecords();
                break;
            case "POST":
                result = await createRecord(body);
                break;
            default:
                return sendMethodNotAllowed(res, "Method Not Allowed!")
        }

        return sendOk(res, result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message})
    }
}