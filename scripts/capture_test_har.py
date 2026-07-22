import os
import sys
import time
import json
from datetime import datetime
from playwright.sync_api import sync_playwright

OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"capture_{datetime.now().strftime('%Y%m%d_%H%M%S')}.har")
BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            locale="ar-SA",
            timezone_id="Asia/Riyadh",
            record_har_path=OUTPUT_FILE,
        )
        page = context.new_page()

        logs = []
        def log(msg):
            logs.append(msg)
            print(msg)

        page.on("console", lambda msg: log(f"CONSOLE {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: log(f"PAGEERROR: {err}"))
        page.on("request", lambda req: log(f"REQ {req.method} {req.url}"))
        page.on("response", lambda res: log(f"RES {res.status} {res.url}"))

        try:
            # 1. Login
            log("[1/5] Navigating to login...")
            page.goto(f"{BASE_URL}/admin/login", wait_until="networkidle")
            log(f"   Login page loaded: {page.url}")

            page.wait_for_selector('input[type="email"]', timeout=10000)
            log("   Email field ready")

            # Clear and fill with delay to trigger React state
            page.click('input[type="email"]')
            page.fill('input[type="email"]', "admin@alipro.com")
            time.sleep(0.5)

            page.click('input[type="password"]')
            page.fill('input[type="password"]', "Admin@123456")
            time.sleep(0.5)

            log("   Credentials filled")

            # Wait for button to be enabled
            page.wait_for_selector('button[type="submit"]:not([disabled])', timeout=5000)
            log("   Submit button enabled")

            # Submit by Enter key (more reliable than click for React forms)
            page.press('input[type="password"]', "Enter")
            log("   Pressed Enter to submit")

            # Wait for navigation
            try:
                page.wait_for_url(lambda url: "/admin/login" not in url, timeout=15000)
                log(f"   ✅ Login success, redirected to: {page.url}")
            except Exception:
                log(f"   ❌ Still on login page: {page.url}")
                body = page.content()
                if "بيانات الدخول غير صحيحة" in body:
                    log("   Error message: بيانات الدخول غير صحيحة")
                log("   Console logs may reveal error")
                raise Exception("Login failed")

            # 2. New product page
            log("[2/5] Navigating to /admin/products/new...")
            page.goto(f"{BASE_URL}/admin/products/new", wait_until="networkidle")
            page.wait_for_selector('input[name="name"]', timeout=10000)
            log(f"   URL: {page.url}")

            # 3. Fill form
            log("[3/5] Filling product form...")
            page.fill('input[name="name"]', "Auto Test Lipstick")
            page.fill('input[name="nameAr"]', "أحمر شفاه آلي تجريبي")
            page.fill('textarea[name="descriptionAr"]', "منتج تجريبي مضاف عبر Playwright")
            page.fill('input[name="price"]', "99")
            page.fill('input[name="wholesalePrice"]', "79")
            page.fill('input[name="minWholesaleQty"]', "10")
            page.fill('input[name="stock"]', "50")
            page.select_option('select[name="categoryId"]', index=0)
            page.fill('input[name="tags"]', "تجريبي,جديد,مكياج")
            log("   Form filled")

            # 4. Submit
            log("[4/5] Submitting form...")
            page.click('button[type="submit"]')
            try:
                page.wait_for_url(lambda url: "/admin/products/new" not in url, timeout=15000)
                log(f"   ✅ Form submitted, redirected to: {page.url}")
            except Exception:
                log(f"   ⚠️ Still on form page: {page.url}")

            # 5. Check products list
            log("[5/5] Checking products list...")
            page.goto(f"{BASE_URL}/admin/products", wait_until="networkidle")
            body_text = page.inner_text("body")
            if "Auto Test Lipstick" in body_text or "أحمر شفاه آلي" in body_text:
                log("   ✅ Product appears in admin products list")
            else:
                log("   ⚠️ Product not found in admin products list")

        except Exception as e:
            log(f"\n❌ Error: {e}")
            screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"error_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png")
            try:
                page.screenshot(path=screenshot_path, full_page=True)
                log(f"Screenshot saved: {screenshot_path}")
            except Exception as se:
                log(f"Could not take screenshot: {se}")
        finally:
            context.close()
            browser.close()

    # Save logs to file
    log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(logs))

    log(f"\nHAR saved: {OUTPUT_FILE}")
    log(f"Logs saved: {log_file}")


if __name__ == "__main__":
    main()
