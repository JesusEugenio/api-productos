import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../conf/dbConnection";

export class ProductController {
  constructor() {}

  public async getAllProducts(_req: Request, res: Response) {
    try {
      const [products] = await pool.execute(
        "SELECT * FROM products WHERE active = TRUE"
      );
      res.json(products);
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [products] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ? AND active = TRUE",
        [id]
      );
      
      if (!products[0]) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      
      res.json(products[0]);
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const { name, price, stock, description, brand, img } = req.body;
      
      if (!name || typeof price !== 'number' || price <= 0 || stock === undefined || !description) {
        res.status(400).json({ message: "invalid data" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)",
        [name, price, stock, description, brand || null, img || null]
      );
      
      res.status(201).json({ message: "product created", id: result.insertId });
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, price, stock, description, brand, img } = req.body;

      if (!name || typeof price !== 'number' || price <= 0 || stock === undefined || !description) {
        res.status(400).json({ message: "invalid data" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE",
        [name, price, stock, description, brand || null, img || null, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      
      res.json({ message: "product updated" });
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE",
        [id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      
      res.json({ message: "product deleted (logical)" });
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async updatePrice(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { price } = req.body;

      if (typeof price !== 'number' || price <= 0) {
        res.status(400).json({ message: "invalid price" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "UPDATE products SET price = ? WHERE id = ? AND active = TRUE",
        [price, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      
      res.json({ message: "price updated" });
    } 
    catch {
      res.status(500).json({ message: "internal server error" });
    }
  }
}