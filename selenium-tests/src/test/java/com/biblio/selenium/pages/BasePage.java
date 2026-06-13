package com.biblio.selenium.pages;

import com.biblio.selenium.config.TestConfig;
import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public abstract class BasePage {

    protected final WebDriver driver;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
    }

    protected void navigateTo(String path) {
        String baseUrl = TestConfig.getBaseUrl();
        if (baseUrl.endsWith("/")) {
            driver.get(baseUrl.substring(0, baseUrl.length() - 1) + path);
        } else {
            driver.get(baseUrl + path);
        }
        WaitUtils.waitForPageLoad(driver);
    }

    protected void click(By locator) {
        WaitUtils.waitForClickable(driver, locator);
        WebElement element = driver.findElement(locator);
        scrollIntoView(element);
        try {
            element.click();
        } catch (Exception e) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    private void scrollIntoView(WebElement element) {
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].scrollIntoView({block: 'center', inline: 'nearest'});", element);
    }

    protected void type(By locator, String text) {
        WaitUtils.waitForVisible(driver, locator);
        WebElement element = driver.findElement(locator);
        element.click();
        String value = text == null ? "" : text;
        ((JavascriptExecutor) driver).executeScript(
                "const el = arguments[0];"
                        + "const value = arguments[1];"
                        + "const setter = Object.getOwnPropertyDescriptor("
                        + "window.HTMLInputElement.prototype, 'value').set;"
                        + "setter.call(el, value);"
                        + "el.dispatchEvent(new Event('input', { bubbles: true }));"
                        + "el.dispatchEvent(new Event('change', { bubbles: true }));",
                element, value);
    }

    protected String getText(By locator) {
        WaitUtils.waitForVisible(driver, locator);
        return driver.findElement(locator).getText();
    }

    protected boolean isDisplayed(By locator) {
        return WaitUtils.isElementPresent(driver, locator);
    }
}
