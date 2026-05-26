import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?premium=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?premium=cancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return Response.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}