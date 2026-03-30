import {Geist, Geist_Mono} from "next/font/google";
import ImageSlider from "@/components/slider";
import CategorySection from "@/components/categories";
import FlashSale from "@/components/flashsales";
// import {registerFCMToken} from "@/utils/util";

const geistSans = Geist({
    variable: "--font-geist-sans", subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono", subsets: ["latin"],
});


export default function Home() {
    // React.useEffect(() => {
    //     window.document.addEventListener("message", (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             if (data.fcmToken) {
    //                 console.log("Received FCM Token from app:", data.fcmToken);
    //                 try{
    //                     localStorage.setItem("device", JSON.stringify(data));
    //                 }
    //                 catch (e){
    //                     console.error(e);
    //                 }
    //
    //                 registerFCMToken(data);
    //
    //
    //             }
    //         } catch (err) {
    //             console.error("Error parsing message", err);
    //         }
    //     });
    // }, []);

    return (<div style={{marginBottom: '3rem'}}>
        <ImageSlider/>
        <CategorySection/>
        <FlashSale newArrivals={true}/>
        <FlashSale/>
        <FlashSale isTopPicks={true}/>
    </div>);
}
