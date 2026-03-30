"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  List,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/router";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "@/redux/cartSlice";
import { fetchApi, seller_email } from "@/utils/util";
import { resetWishlist } from "@/redux/wishlistSlice";

const TRENDING_LABELS = [
  "New Arrivals",
  "Best Sellers",
  "Recommended",
  "Trending Now",
];

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState(null);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setIsMobileMenuOpen(false);
    setDesktopOpenMenu(null);
  }, [router.asPath]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoadingMenus(true);
        const data = await fetchApi("/get-menus", {
          method: "POST",
          headers: {
            "x-user": seller_email,
          },
          body: { seller_email },
        });
        setMenuItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoadingMenus(false);
      }
    };

    fetchMenus();
  }, []);

  const featuredMenus = useMemo(() => menuItems.slice(0, 5), [menuItems]);
  const extraMenus = useMemo(() => menuItems.slice(5), [menuItems]);

  const gotoLogin = () => {
    router.push("/loginpage");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    dispatch(resetCart({}));
    dispatch(resetWishlist({}));
    router.push("/");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ""}`);
    setShowDesktopSearch(false);
    setShowMobileSearch(false);
  };

  const goToProductList = async (event, category, subCategory) => {
    event.preventDefault();
    try {
      const url = `/${encodeURIComponent(category.name)}/${encodeURIComponent(subCategory.name)}?categoryId=${category.id}&subCategoryId=${subCategory.id}&_ts=${Date.now()}`;
      setDesktopOpenMenu(null);
      setIsMobileMenuOpen(false);
      await router.push(url);
    } catch (error) {
      console.error(error);
    }
  };

  const renderMenuPanel = (item) => {
    if (!item?.submenu?.length) return null;

    return (
      <div className="absolute left-1/2 top-full z-50 mt-4 w-[560px] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Trending</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.name}</h3>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {item.submenu.length} picks
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {item.submenu.map((sub, index) => (
            <Link
              key={sub.name}
              href="#"
              onClick={(e) => goToProductList(e, item, sub)}
              className="group rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-800">{sub.name}</span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
                  {TRENDING_LABELS[index % TRENDING_LABELS.length]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="hidden md:block border-b border-gray-100">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles size={16} className="text-gray-900" />
              <span className="font-medium text-gray-900">Trending now</span>
              <div className="flex items-center gap-2">
                {TRENDING_LABELS.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a
                href="https://www.instagram.com/diya_jewelz?igsh=aW1maGJpdXBtYmxw"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-black"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/share/1aqFcp5nAK/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-black"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <nav className="container mx-auto hidden items-center justify-between gap-6 px-4 py-4 md:flex">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Tharizan World" width={52} height={52} className="rounded-2xl" />
              <div>
                <div className="text-lg font-semibold tracking-tight text-gray-900">Tharizan World</div>
                <div className="text-xs uppercase tracking-[0.35em] text-gray-400">Modern Store</div>
              </div>
            </Link>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            {loadingMenus ? (
              <div className="flex gap-3">
                {Array(5)
                  .fill("")
                  .map((_, index) => (
                    <div key={index} className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
                  ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-2">
                {featuredMenus.map((item, index) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setDesktopOpenMenu(index)}
                    onMouseLeave={() => setDesktopOpenMenu(null)}
                  >
                    <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-black">
                      <span>{item.name}</span>
                      {item.submenu?.length ? <ChevronDown size={14} /> : null}
                    </button>
                    {desktopOpenMenu === index ? renderMenuPanel(item) : null}
                  </div>
                ))}

                {extraMenus.length ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDesktopOpenMenu("more")}
                    onMouseLeave={() => setDesktopOpenMenu(null)}
                  >
                    <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-black">
                      <span>More</span>
                      <ChevronDown size={14} />
                    </button>
                    {desktopOpenMenu === "more" ? (
                      <div className="absolute right-0 top-full z-50 mt-4 w-72 rounded-3xl border border-gray-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                        {extraMenus.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => setDesktopOpenMenu(item.name)}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
                          >
                            <span>{item.name}</span>
                            {item.submenu?.length ? <ChevronDown size={14} /> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {typeof desktopOpenMenu === "string" && desktopOpenMenu !== "more"
                      ? renderMenuPanel(extraMenus.find((item) => item.name === desktopOpenMenu))
                      : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showDesktopSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent text-sm outline-none"
                  autoFocus
                />
                <button type="button" onClick={() => setShowDesktopSearch(false)}>
                  <X size={18} className="text-gray-500" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowDesktopSearch(true)}
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:border-gray-900 hover:text-black"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push("/orders")}
                  className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:border-gray-900 hover:text-black"
                  aria-label="Orders"
                >
                  <ShoppingBag size={18} />
                </button>
                <button
                  onClick={() => router.push("/accounts")}
                  className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:border-gray-900 hover:text-black"
                  aria-label="Account"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:border-gray-900 hover:text-black"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={gotoLogin}
                className="rounded-full border border-gray-200 p-3 text-gray-700 transition hover:border-gray-900 hover:text-black"
                aria-label="Login"
              >
                <User size={18} />
              </button>
            )}

            <Link
              href="/cart"
              className="relative rounded-full border border-gray-900 bg-gray-900 p-3 text-white transition hover:bg-black"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartItems.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {cartItems.length}
                </span>
              ) : null}
            </Link>
          </div>
        </nav>

        <nav className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-full border border-gray-200 p-2.5 text-gray-800"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Tharizan World" width={40} height={40} className="rounded-2xl" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Tharizan World</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Trending</div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileSearch((value) => !value)}
                className="rounded-full border border-gray-200 p-2.5 text-gray-800"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <Link href="/cart" className="relative rounded-full border border-gray-900 bg-gray-900 p-2.5 text-white">
                <ShoppingBag size={18} />
                {cartItems.length > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                    {cartItems.length}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto border-t border-gray-100 px-4 py-3">
            <div className="flex gap-2">
              {TRENDING_LABELS.map((label) => (
                <span
                  key={label}
                  className="whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {showMobileSearch ? (
            <form onSubmit={handleSearchSubmit} className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-3">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
              </div>
            </form>
          ) : null}
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/20 transition ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Menu</p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900">Trending Collections</h2>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full border border-gray-200 p-2.5 text-gray-800"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2">
            {TRENDING_LABELS.map((label) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700">
                {label}
              </div>
            ))}
          </div>

          {loadingMenus ? (
            <div className="space-y-3">
              {Array(6)
                .fill("")
                .map((_, index) => (
                  <div key={index} className="h-12 animate-pulse rounded-2xl bg-gray-100" />
                ))}
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={item.name} className="rounded-2xl border border-gray-200">
                  <button
                    onClick={() => {
                      if (!item.submenu?.length) return;
                      setMobileOpenMenu(mobileOpenMenu === index ? null : index);
                    }}
                    className="flex w-full items-center justify-between px-4 py-4 text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-400">
                        {TRENDING_LABELS[index % TRENDING_LABELS.length]}
                      </div>
                    </div>
                    {item.submenu?.length ? <ChevronDown size={16} className="text-gray-500" /> : null}
                  </button>

                  {item.submenu?.length && mobileOpenMenu === index ? (
                    <div className="border-t border-gray-200 px-3 py-3">
                      <div className="grid gap-2">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href="#"
                            onClick={(e) => goToProductList(e, item, sub)}
                            className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
            {isLoggedIn ? (
              <>
                <button onClick={() => router.push("/orders")} className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">
                  <ShoppingBag size={18} />
                  Orders
                </button>
                <button onClick={() => router.push("/accounts")} className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">
                  <List size={18} />
                  Account
                </button>
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button onClick={gotoLogin} className="flex w-full items-center gap-3 rounded-2xl border border-gray-900 bg-gray-900 px-4 py-3 text-sm font-medium text-white">
                <User size={18} />
                Log in
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
