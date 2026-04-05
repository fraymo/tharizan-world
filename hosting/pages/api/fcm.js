import {fetchApi} from "@/utils/util";

export default async function handler(req, res) {
    try {
        const body = {
            ...req.query, ...req.body,
        };
        const sellerEmail = body.seller_email;
        const apiResponse = await fetchApi("/fcm", {
            headers: {'Content-Type': 'application/json',  'x-user': sellerEmail},
            method: "POST", body
        });

       res.status(200).json(apiResponse);
    } catch (error) {
        console.error("Error fetching from external API:", error);
        res.status(500).json({message: "Error fetching data from external API", error: JSON.stringify(error)});
    }
}
