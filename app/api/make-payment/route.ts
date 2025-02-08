import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/config/bd";
import { v4 as uuidv4 } from "uuid";
import { createPayment } from "@/service/bkash";

connectDb()

const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL!,
    username: process.env.BKASH_CHECKOUT_URL_USER_NAME!,
    password: process.env.BKASH_CHECKOUT_URL_PASSWORD!,
    app_key: process.env.BKASH_CHECKOUT_URL_APP_KEY!,
    app_secret: process.env.BKASH_CHECKOUT_URL_APP_SECRET!,
}

export async function POST(req: NextRequest) {
    try {
        const { email, name, phone } = await req.json();

        const myUrl = req.headers.get("origin");
        const paymentId = uuidv4().substring(0, 10);
        const amount = 1000;

        const paymentDetails = {
            amount: amount,
            callbackURL: `${myUrl}/api/callback`,
            orderID: paymentId,
            reference: "1",
            name: name,
            email: email,
            phone: phone,
        }

        const createPaymentResponse = await createPayment(bkashConfig, paymentDetails)
        console.log(createPaymentResponse);


        if (createPaymentResponse.statusCode !== "0000") {
            return NextResponse.json({ message: "Payment Failed" });
        }


        return NextResponse.json({ message: "Payment Success", url: createPaymentResponse.bkashURL });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" });
    }
}