import { Router } from "express";
import { getStock, updateStock, getStockHistory } from "../controllers/stock";
import { getAllStockHistory, getStockHistoryById, deleteStockHistory } from "../controllers/stockHistory";
import authMiddleware from "../middleware/auth";
import { validateStock } from "../validators/stock";

const stockHistoryRouter = Router();

stockHistoryRouter.use(validateStock)
// Stock routes
stockHistoryRouter.get("/variant/:variantId", authMiddleware, getStock);
stockHistoryRouter.put("/variant/:variantId", authMiddleware, updateStock);
stockHistoryRouter.get("/variant/:variantId/history", authMiddleware, getStockHistory);

// Stock History routes
stockHistoryRouter.get("/history", authMiddleware, getAllStockHistory);
stockHistoryRouter.get("/history/:id", authMiddleware, getStockHistoryById);
stockHistoryRouter.delete("/history/:id", authMiddleware, deleteStockHistory);

export default stockHistoryRouter;
