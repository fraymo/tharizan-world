import {fetchApi, seller_email} from "@/utils/util";

export default async function handler(req, res) {
    try {
        const body = {
            ...req.query, ...req.body, seller_email: process.env.NEXT_PUBLIC_SELLER_EMAIL,
        };

        console.log("[debug body]", body);

        const apiResponse = await fetchApi("/posts/razor-status", {
            headers: {'Content-Type': 'application/json',  'x-user': seller_email},
            method: "POST", body
        });

        if (apiResponse && apiResponse.redirectUrl) {
            res.redirect(307, apiResponse.redirectUrl);
        } else {
            console.error("Redirect URL not found in API response:", apiResponse);
            res.status(400).json({message: "Redirect URL not found"});
        }
    } catch (error) {
        console.error("Error fetching from external API:", error);
        res.status(500).json({message: "Error fetching data from external API", error: JSON.stringify(error)});
    }
}
