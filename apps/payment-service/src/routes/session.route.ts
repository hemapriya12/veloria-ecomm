import { Router, Request, Response } from "express";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
const sessionRoute = Router();

sessionRoute.post("/create-checkout-session", shouldBeUser as any, async (req: Request, res: Response) => {
  const { cart }: { cart: CartItemsType } = req.body;
  const userId = (req as any).userId;

  const lineItems = cart.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });

    return res.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error: any) {
    console.error("[Stripe error]", error?.message ?? error);
    return res.status(500).json({ error: { message: error?.message ?? "Stripe session creation failed" } });
  }
});

sessionRoute.get("/:session_id", async (req: Request, res: Response) => {
  const { session_id } = req.params;
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  return res.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
