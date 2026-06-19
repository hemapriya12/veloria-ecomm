import { Router, Request, Response } from "express";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware";
import { Order, FulfillmentStatus, ReturnStatus, Review } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "@repo/types";

const orderRoute = Router();

orderRoute.get("/user-orders", shouldBeUser, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.userId });
  return res.json(orders);
});

orderRoute.post("/orders", shouldBeUser, async (req: Request, res: Response) => {
  try {
    const { email, amount, products } = req.body;

    // Decrement stock in product-service for each line item
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL ?? "http://localhost:8000";
    await Promise.allSettled(
      (products as Array<{ productId?: number; quantity: number }>)
        .filter((p) => p.productId)
        .map((p) =>
          fetch(`${productServiceUrl}/products/${p.productId}/stock`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decrement: p.quantity }),
          })
        )
    );

    const order = new Order({
      userId: req.userId,
      email,
      amount,
      products,
      status: "success",
      fulfillmentStatus: "pending",
    });
    await order.save();
    return res.status(201).json(order);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

orderRoute.get("/orders/summary", shouldBeAdmin, async (req: Request, res: Response) => {
  const [totalOrders, revenueResult, pendingShipments, deliveredOrders] =
    await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Order.countDocuments({ fulfillmentStatus: "pending" }),
      Order.countDocuments({ fulfillmentStatus: "delivered" }),
    ]);

  return res.json({
    totalOrders,
    totalRevenue: revenueResult[0]?.total ?? 0,
    pendingShipments,
    deliveredOrders,
  });
});

orderRoute.get("/orders", shouldBeAdmin, async (req: Request, res: Response) => {
  const { limit } = req.query as { limit: number };
  const orders = await Order.find().limit(limit).sort({ createdAt: -1 });
  return res.json(orders);
});

orderRoute.put("/orders/:id/status", shouldBeAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fulfillmentStatus } = req.body;

  if (!FulfillmentStatus.includes(fulfillmentStatus)) {
    return res.status(400).json({ message: "Invalid fulfillment status" });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { fulfillmentStatus },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.json(order);
});

orderRoute.get("/order-chart", shouldBeAdmin, async (req: Request, res: Response) => {
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  const raw = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo, $lte: now } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: 1 },
        successful: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        total: 1,
        successful: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const results: OrderChartType[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const match = raw.find((item) => item.year === year && item.month === month);
    results.push({
      month: monthNames[month - 1] as string,
      total: match ? match.total : 0,
      successful: match ? match.successful : 0,
    });
  }

  return res.json(results);
});

// ── Returns ──────────────────────────────────────────────────────────────────

// Buyer: request a return
orderRoute.post("/orders/:id/return", shouldBeUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = await Order.findOne({ _id: id, userId: req.userId });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if ((order as any).returnStatus !== "none")
    return res.status(400).json({ message: "Return already requested" });

  // Enforce 30-day return window from order creation date
  const orderDate = new Date((order as any).createdAt);
  const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceOrder > 30)
    return res.status(400).json({ message: "Return window has expired. Returns are only accepted within 30 days of purchase." });

  const updated = await Order.findByIdAndUpdate(id, { returnStatus: "requested", returnReason: reason }, { new: true });
  return res.json(updated);
});

// Buyer: cancel a pending return request
orderRoute.delete("/orders/:id/return", shouldBeUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, userId: req.userId });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if ((order as any).returnStatus !== "requested")
    return res.status(400).json({ message: "Can only cancel a pending return request" });
  const updated = await Order.findByIdAndUpdate(id, { returnStatus: "none", returnReason: "" }, { new: true });
  return res.json(updated);
});

// Seller: get all orders with return requests
orderRoute.get("/returns", shouldBeAdmin, async (req: Request, res: Response) => {
  const returns = await Order.find({ returnStatus: { $ne: "none" } }).sort({ updatedAt: -1 });
  return res.json(returns);
});

// Seller: approve or reject return
orderRoute.put("/orders/:id/return-status", shouldBeAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { returnStatus } = req.body;
  if (!ReturnStatus.includes(returnStatus))
    return res.status(400).json({ message: "Invalid return status" });
  const updated = await Order.findByIdAndUpdate(id, { returnStatus }, { new: true });
  if (!updated) return res.status(404).json({ message: "Order not found" });
  return res.json(updated);
});

// ── Reviews ───────────────────────────────────────────────────────────────────

// Buyer: submit a review
orderRoute.post("/reviews", shouldBeUser, async (req: Request, res: Response) => {
  try {
    const { productId, productName, rating, comment, userName } = req.body;
    const existing = await Review.findOne({ productId, userId: req.userId });
    if (existing) return res.status(400).json({ message: "You already reviewed this product" });
    const review = await Review.create({ productId, productName: productName ?? "", userId: req.userId, userName, rating, comment });
    return res.status(201).json(review);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Public: get reviews for a product
orderRoute.get("/reviews/:productId", async (req: Request, res: Response) => {
  const reviews = await Review.find({ productId: Number(req.params.productId) }).sort({ createdAt: -1 });
  return res.json(reviews);
});

// Seller: get all reviews
orderRoute.get("/reviews", shouldBeAdmin, async (req: Request, res: Response) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  return res.json(reviews);
});

export { orderRoute };
