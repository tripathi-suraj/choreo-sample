import cache from "../cache.mjs";
import { v4 as uuidv4 } from "uuid";
import {getConnection} from "../library/database.mjs";;

function attachRoutes(app){
    app.get("/", (req, res) => {
        getConnection(function(err,result){
            console.log(err,result);
        })
        return res.status(200).send("Hello POC");
    });

    app.post("/reading-list/books", (req, res) => {
        const { title, author, status } = req.body;
        const uuid = uuidv4();
        if (!(status === "read" || status === "to_read" || status === "reading")) {
          return res.status(400).json({
            error: "Status is invalid. Accepted statuses: read | to_read | reading",
          });
        }
        if (!title || !author || !status) {
          return res
            .status(400)
            .json({ error: "Title, Status or Author is empty" });
        }
        const value = { uuid, title, author, status };
        cache.set(uuid, value, 86400);
        return res.status(201).json({ uuid, title, author });
      });
    
    // update status of a book by uuid
    app.put("/reading-list/books/:uuid", (req, res) => {
    const uuid = req.params.uuid;
    const { status } = req.body;
    if (!uuid || typeof uuid !== "string") {
        return res.status(400).json({ error: "missing or invalid UUID" });
    }
    if (!cache.has(uuid)) {
        return res.status(404).json({ error: "UUID does not exist" });
    }
    if (!(status === "read" || status === "to_read" || status === "reading")) {
        return res.status(400).json({
        error: "Status is invalid. Accepted statuses: read | to_read | reading",
        });
    }
    const value = cache.get(uuid);
    value.status = status;
    cache.set(uuid, value);
    return res.json({ uuid, status });
    });

    // get the list of books
    app.get("/reading-list/books", (_, res) => {
    const keys = cache.keys();
    const allData = {};
    for (const key of keys) {
        allData[key] = cache.get(key);
    }
    return res.json(allData);
    });

    // get a book by uuid
    app.get("/reading-list/books/:uuid", (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid || typeof uuid !== "string") {
        return res.status(400).json({ error: "missing or invalid UUID" });
    }
    if (!cache.has(uuid)) {
        return res.status(404).json({ error: "UUID does not exist" });
    }
    const value = cache.get(uuid);
    return res.json(value);
    });

    // delete a book by uuid
    app.delete("/reading-list/books/:uuid", (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid || typeof uuid !== "string") {
        return res.status(400).json({ error: "missing or invalid UUID" });
    }
    if (!cache.has(uuid)) {
        return res.status(404).json({ error: "UUID does not exist" });
    }
    cache.del(uuid);
    return res.json({ uuid });
    });
}
export {attachRoutes}