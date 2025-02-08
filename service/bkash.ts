"use server"

import axios from "axios"
import { v4 as uuidv4 } from "uuid";
import Bkash from "@/models/bkashToken";


interface BkashConfig {
    base_url: string | undefined,
    username: string | undefined,
    password: string | undefined,
    app_key: string | undefined,
    app_secret: string | undefined
}

interface PaymentDetails {
    amount: number,       // your product price
    callbackURL: string,  // your callback route
    orderID: string,      // your orderID
    reference: string,
    name: string,
    email: string,
    phone: string,
}


export async function createPayment(bkashConfig: BkashConfig, paymentDetails: PaymentDetails) {
    try {
        const { amount, callbackURL, orderID, reference } = paymentDetails
        if (!amount) {
            return {
                statusCode: 2065,
                statusMessage: 'amount required'
            }
        } else {
            if (amount < 1) {
                return {
                    statusCode: 2065,
                    statusMessage: 'minimum amount 1'
                }
            }
        }

        if (!callbackURL) {
            return {
                statusCode: 2065,
                statusMessage: 'callbackURL required'
            }
        }

        const response = await axios.post(
            `${bkashConfig?.base_url}/tokenized/checkout/create`,
            {
                mode: "0011",
                currency: "BDT",
                intent: "sale",
                amount,
                callbackURL,
                payerReference: reference || "1",
                merchantInvoiceNumber: orderID || "Inv_" + uuidv4().substring(0, 6)
            },
            {
                headers: await authHeaders(bkashConfig),
            }
        )

        return response?.data
    } catch (e) {
        console.error("Create Bkash Payment Error:", e);
        return e
    }
}

export async function executePayment(bkashConfig: BkashConfig, paymentID: string) {
    try {
        const response = await axios.post(`${bkashConfig?.base_url}/tokenized/checkout/execute`,
            {
                paymentID,
            },
            {
                headers: await authHeaders(bkashConfig),
            }
        )

        return response?.data
    } catch (error) {
        console.log("Error from bkash exectePayment: ", error)
        return null
    }
}

const authHeaders = async (bkashConfig: BkashConfig) => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: await grantToken(bkashConfig),
        "x-app-key": bkashConfig?.app_key,
    }
}

const grantToken = async (bkashConfig: BkashConfig) => {
    try {
        const findToken = await Bkash.findOne({})

        if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) { // 1 hour
            return await setToken(bkashConfig)
        }

        return findToken.auth_token
    } catch (e) {
        console.log(e)
        return null
    }
}

const setToken = async (bkashConfig: BkashConfig) => {
    const response = await axios.post(
        `${bkashConfig?.base_url}/tokenized/checkout/token/grant`,
        tokenParameters(bkashConfig),
        {
            headers: tokenHeaders(bkashConfig),
        }
    )
    if (response?.data?.id_token) {
        const findToken = await Bkash.findOne({})
        if (findToken) {
            findToken.auth_token = response?.data?.id_token
            await findToken.save()
        } else {
            await Bkash.create(
                {
                    auth_token: response?.data?.id_token
                }
            )
        }
    }
    return response?.data?.id_token
}

const tokenParameters = (bkashConfig: BkashConfig) => {
    return {
        app_key: bkashConfig?.app_key,
        app_secret: bkashConfig?.app_secret,
    }
}

const tokenHeaders = (bkashConfig: BkashConfig) => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: bkashConfig?.username,
        password: bkashConfig?.password,
    }
}
