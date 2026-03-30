import Navbar from './navbar'
import Footer from './footer'
import SocialBar from "@/components/Topbar"
import Home from "@/components/Slider1"
import  Testimonials  from './Testmonials'
export default function Layout({children}) {
    return (
        <>
        <SocialBar/>
            <Navbar/>
            <main>{children}</main>
            <Home/>
            <Testimonials/>
            <Footer/>
        </>
    )
}
