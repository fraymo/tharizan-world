import Navbar from './navbar'
import Footer from './footer'
import SocialBar from "@/components/Topbar"
import Home from "@/components/Slider1"
import Testimonials from './Testmonials'
import {useRouter} from "next/router"
export default function Layout({children}) {
    const router = useRouter();
    const isPromoRoot = router.pathname === "/";

    return (
        <>
            {!isPromoRoot ? <SocialBar/> : null}
            {!isPromoRoot ? <Navbar/> : null}
            <main>{children}</main>
            {!isPromoRoot ? <Home/> : null}
            {!isPromoRoot ? <Testimonials/> : null}
            {!isPromoRoot ? <Footer/> : null}
        </>
    )
}
