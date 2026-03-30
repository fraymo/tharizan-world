import {fetchApi, seller_email} from "@/utils/util";

export default async function handler(req, res) {
    try {
        const body = {
            ...req.query, ...req.body, seller_email: process.env.NEXT_PUBLIC_SELLER_EMAIL,
        };
        const apiResponse = await fetchApi("/fcm", {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method: "POST", body
        });

       req.status(200).json(apiResponse);
    } catch (error) {
        console.error("Error fetching from external API:", error);
        res.status(500).json({message: "Error fetching data from external API", error: JSON.stringify(error)});
    }
}
