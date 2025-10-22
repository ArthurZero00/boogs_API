export function validateBook(req, res, next) {
    const { title, author, year } = req.body;
  
    if (
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof year !== "number" ||
      !title.trim() ||
      !author.trim()
    ) {
      return res.status(400).json({ error: "Invalid input: all values are required." });
    }
  
    next();
  }